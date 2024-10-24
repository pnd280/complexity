import { LanguageModel, FocusMode } from "@/content-script/components/QueryBox";
import {
  mainQueryBoxStore,
  followUpQueryBoxStore,
} from "@/content-script/components/QueryBox/context";
import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { queryBoxStore } from "@/content-script/session-store/query-box";
import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import {
  SpacesApiResponse,
  ThreadMessageApiResponse,
  UserAiProfileApiResponse,
} from "@/types/pplx-api.types";
import { Space, SpaceSchema } from "@/types/space.types";
import { UserAiProfile, UserAiProfileSchema } from "@/types/user-ai-profile";
import {
  AddInterceptorMatchCondition,
  LongPollingEventData,
  MessageData,
  WebSocketEventData,
} from "@/types/webpage-messenger.types";
import { isParsedWsMessage, WsParsedMessage } from "@/types/ws.types";
import { queryClient } from "@/utils/ts-query-query-client";
import { parseUrl } from "@/utils/utils";
import WsMessageParser from "@/utils/WsMessageParser";

export default class WebpageMessageInterceptor {
  static updateQueryLimits() {
    webpageMessenger.addInterceptor({
      matchCondition: (messageData: MessageData<any>) => {
        const parsedPayload = parseStructuredMessage(messageData);

        if (!parsedPayload) return { match: false };

        return {
          match:
            parsedPayload.event === "get_rate_limit" ||
            parsedPayload.event === "get_opus_rate_limit",
        };
      },
      callback: async (messageData) => {
        queryClient.invalidateQueries({ queryKey: ["userSettings"] });

        return messageData;
      },
      stopCondition: () => false,
    });
  }

  static detectSpaceSwap() {
    webpageMessenger.addInterceptor({
      matchCondition: (messageData: MessageData<any>) => {
        const parsedPayload = parseStructuredMessage(messageData);

        if (!parsedPayload) return { match: false };

        return {
          match:
            (parsedPayload.event === "upsert_thread_collection" &&
              parsedPayload.data?.length > 0 &&
              "new_collection_uuid" in parsedPayload.data[0]) ||
            parsedPayload.event === "remove_collection_thread",
        };
      },
      callback: async (messageData: MessageData<any>) => {
        setTimeout(async () => {
          await this.waitForUpsertThreadCollection();

          queryClient.invalidateQueries({
            queryKey: [
              "threadInfo",
              parseUrl().pathname.split("/").pop() || "",
            ],
            exact: true,
          });
        }, 0);

        return messageData;
      },
      stopCondition: () => false,
    });
  }

  static inspectWebSocketEvents() {
    webpageMessenger.addInterceptor({
      matchCondition: (messageData) => {
        if (messageData.event !== "webSocketEvent") return { match: false };

        const webSocketMessageData =
          messageData as MessageData<WebSocketEventData>;

        return {
          match: webSocketMessageData.event === "webSocketEvent",
        };
      },
      callback: async (messageData: MessageData<WebSocketEventData>) => {
        console.log("web socket:", messageData.payload.payload);
        return messageData;
      },
      stopCondition: () => false,
    });
  }

  static inspectLongPollingEvents() {
    webpageMessenger.addInterceptor({
      matchCondition: (messageData) => {
        const webSocketMessageData =
          messageData as MessageData<LongPollingEventData>;

        return {
          match: webSocketMessageData.event === "longPollingEvent",
        };
      },
      callback: async (messageData: MessageData<LongPollingEventData>) => {
        console.log("long polling:", messageData.payload);
        return messageData;
      },
      stopCondition: () => false,
    });
  }

  static alterQueries() {
    webpageMessenger.addInterceptor({
      matchCondition: (messageData: MessageData<any>) => {
        // TODO: Refactor this mess

        const webSocketMessageData = messageData as MessageData<
          WebSocketEventData | LongPollingEventData
        >;

        const parsedPayload: WsParsedMessage | null | string =
          WsMessageParser.parse(webSocketMessageData.payload.payload);

        if (!isParsedWsMessage(parsedPayload)) return { match: false };

        if (parsedPayload.event !== "perplexity_ask") {
          return { match: false };
        }

        if (parsedPayload.data[1].query_source === "default_search") {
          return { match: false };
        }

        if (parsedPayload.data[1].ignore_interceptor === true) {
          return { match: false };
        }

        const newModelPreference =
          CplxUserSettings.get().generalSettings.queryBoxSelectors
            .languageModel && parsedPayload.data?.[1].query_source !== "retry"
            ? queryBoxStore.getState().selectedLanguageModel
            : parsedPayload.data[1].model_preference;

        let newSearchFocus: FocusMode["code"] = CplxUserSettings.get()
          .generalSettings.queryBoxSelectors.spaceNFocus
          ? mainQueryBoxStore.getState().focusMode
          : parsedPayload.data[1].search_focus;

        let newTargetCollectionUuid = CplxUserSettings.get().generalSettings
          .queryBoxSelectors.spaceNFocus
          ? parsedPayload.data[1].query_source === "home" ||
            parsedPayload.data[1].query_source === "modal"
            ? queryBoxStore.getState().selectedSpaceUuid
            : parsedPayload.data[1].target_collection_uuid
          : undefined;

        const selectedSpaceUuid = queryBoxStore.getState().selectedSpaceUuid;
        const focusMode = mainQueryBoxStore.getState().focusMode;

        const isFollowUpQuery =
          parsedPayload.data[1].query_source === "followup" ||
          parsedPayload.data[1].query_source === "edit" ||
          parsedPayload.data[1].query_source === "retry";

        const includeSpaceFiles = (
          isFollowUpQuery ? followUpQueryBoxStore : mainQueryBoxStore
        ).getState().includeSpaceFiles;

        const includeOrgFiles = (
          isFollowUpQuery ? followUpQueryBoxStore : mainQueryBoxStore
        ).getState().includeOrgFiles;

        let newQuerySource =
          (parsedPayload.data[1].query_source === "home" ||
            parsedPayload.data[1].query_source === "modal") &&
          selectedSpaceUuid
            ? "collection"
            : parsedPayload.data[1].query_source;

        let sources: string[] = parsedPayload.data[1].sources;

        if (
          CplxUserSettings.get().generalSettings.queryBoxSelectors.spaceNFocus
        ) {
          sources = [];

          if (focusMode !== "writing") sources.push("web");

          if (includeSpaceFiles) {
            sources.push("space");

            const currentThreadInfo = queryClient.getQueryData<
              ThreadMessageApiResponse[]
            >(["threadInfo", parseUrl().pathname.split("/").pop() || ""]);

            if (currentThreadInfo && currentThreadInfo[0].collection_info) {
              newTargetCollectionUuid =
                currentThreadInfo[0].collection_info?.uuid;
            }
          }

          if (includeOrgFiles) {
            sources.push("org");
          }

          if (includeSpaceFiles || includeOrgFiles) {
            if (newSearchFocus === "writing") newSearchFocus = "internet";

            // TODO: Remove this temp fix
            if (parsedPayload.data[1].query_source === "retry") {
              newQuerySource = "edit";
            }
          }
        }

        parsedPayload.data[1] = {
          ...parsedPayload.data[1],
          query_source: newQuerySource,
          model_preference: newModelPreference,
          // dont override search focus for follow-up queries (doesnt work anymore)
          search_focus: isFollowUpQuery
            ? parsedPayload.data[1].search_focus
            : newSearchFocus,
          target_collection_uuid: newTargetCollectionUuid,
          sources,
        };

        return {
          match: parsedPayload.event === "perplexity_ask",
          args: [
            {
              newPayload: WsMessageParser.stringify(parsedPayload),
            },
          ],
        };
      },
      callback: async (
        messageData: MessageData<WebSocketEventData | LongPollingEventData>,
        args,
      ) => {
        return { ...messageData, payload: { payload: args[0].newPayload } };
      },
      stopCondition: () => false,
    });
  }

  static alterNextQuery({
    languageModel,
    proSearchState,
  }: {
    languageModel?: LanguageModel["code"];
    proSearchState?: boolean;
  }) {
    return webpageMessenger.addInterceptor({
      matchCondition: (messageData: MessageData<any>) => {
        const webSocketMessageData = messageData as MessageData<
          WebSocketEventData | LongPollingEventData
        >;

        const parsedPayload: WsParsedMessage | null | string =
          WsMessageParser.parse(webSocketMessageData.payload.payload);

        if (!isParsedWsMessage(parsedPayload)) return { match: false };

        if (
          parsedPayload.event !== "perplexity_ask" ||
          parsedPayload.data[1].query_source === "default_search"
        ) {
          return { match: false };
        }

        parsedPayload.data[1] = {
          ...parsedPayload.data[1],
          model_preference: languageModel,
          mode: proSearchState ? "copilot" : parsedPayload.data[1].mode,
        };

        return {
          match: parsedPayload.event === "perplexity_ask",
          args: [
            {
              newPayload: WsMessageParser.stringify(parsedPayload),
            },
          ],
        };
      },
      callback: async (
        messageData: MessageData<WebSocketEventData | LongPollingEventData>,
        args,
      ) => {
        return { ...messageData, payload: { payload: args[0].newPayload } };
      },
      stopCondition: () => true,
      timeout: 5000,
      stopPropagation: true,
    });
  }

  static removeComplexityIdentifier() {
    webpageMessenger.addInterceptor({
      matchCondition: (messageData: MessageData<any>) => {
        const webSocketMessageData = messageData as MessageData<
          WebSocketEventData | LongPollingEventData
        >;

        const parsedPayload: WsParsedMessage | null | string =
          WsMessageParser.parse(webSocketMessageData.payload.payload);

        if (!isParsedWsMessage(parsedPayload)) return { match: false };

        const match = parsedPayload.data?.[0]?.is_complexity;

        if (parsedPayload.data?.[0]?.is_complexity != null) {
          parsedPayload.data[0].is_complexity = undefined;
        }

        return {
          match,
          args: [{ newPayload: WsMessageParser.stringify(parsedPayload) }],
        };
      },
      callback: async (messageData, args) => {
        return { ...messageData, payload: { payload: args[0].newPayload } };
      },
      stopCondition: () => false,
    });
  }

  static blockTelemetry() {
    if (!CplxUserSettings.get().generalSettings.qolTweaks.blockTelemetry)
      return;

    webpageMessenger.addInterceptor({
      matchCondition: (messageData: MessageData<any>) => {
        const webSocketMessageData = messageData as MessageData<
          WebSocketEventData | LongPollingEventData
        >;

        const parsedPayload: WsParsedMessage | null | string =
          WsMessageParser.parse(webSocketMessageData.payload.payload);

        if (!isParsedWsMessage(parsedPayload)) return { match: false };

        return {
          match: parsedPayload.event === "analytics_event",
        };
      },
      callback: async () => {
        return null;
      },
      stopCondition: () => false,
    });
  }

  static waitForUpsertThreadCollection() {
    const matchCondition = (messageData: MessageData<any>) => {
      const parsedPayload = parseStructuredMessage(messageData);

      if (!parsedPayload) return false;

      return (
        parsedPayload.data?.length === 1 &&
        parsedPayload.data[0].status === "completed"
      );
    };

    return new Promise((resolve) => {
      webpageMessenger.addInterceptor({
        matchCondition: (messageData: MessageData<any>) => {
          return { match: matchCondition(messageData) };
        },
        callback: async (messageData: MessageData<any>) => {
          resolve(null);
          return messageData;
        },
        stopCondition: (messageData) => matchCondition(messageData), // stop after the first match
      });
    });
  }

  static waitForUserAiProfile(): Promise<UserAiProfile> {
    const matchCondition: AddInterceptorMatchCondition<
      any,
      {
        userAiProfile: UserAiProfile;
      }
    > = (messageData: MessageData<any>) => {
      const parsedPayload: WsParsedMessage | null =
        parseStructuredMessage(messageData);

      if (!parsedPayload) return { match: false };

      if (parsedPayload.messageCode !== 430) return { match: false };

      if (parsedPayload.data?.length !== 1) return { match: false };

      const userAiProfile = parsedPayload.data[0] as UserAiProfileApiResponse;

      const validate = UserAiProfileSchema.safeParse(userAiProfile);

      if (!validate.success) return { match: false };

      return {
        match: true,
        args: [
          {
            userAiProfile: validate.data,
          },
        ],
      };
    };

    return new Promise((resolve, reject) => {
      const removeInterceptor = webpageMessenger.addInterceptor({
        matchCondition,
        callback: async (messageData: MessageData<any>, args) => {
          resolve(args[0].userAiProfile);
          return messageData;
        },
        stopCondition: (messageData) => matchCondition(messageData).match,
      });

      setTimeout(() => {
        removeInterceptor();
        reject(new Error("Fetching user profile settings timed out"));
      }, 5000);
    });
  }

  static waitForCollections(): Promise<Space[]> {
    const matchCondition: AddInterceptorMatchCondition<
      any,
      { collections: any[] }
    > = (messageData) => {
      const parsedPayload: WsParsedMessage | null =
        parseStructuredMessage(messageData);

      if (!parsedPayload) return { match: false };

      if (parsedPayload.messageCode !== 431) return { match: false };

      if (
        parsedPayload.data?.length !== 1 ||
        !Array.isArray(parsedPayload.data[0]) ||
        parsedPayload.data[0].length <= 0
      )
        return { match: false };

      const collections = parsedPayload.data[0] as SpacesApiResponse;

      const validate = SpaceSchema.safeParse(collections[0]);

      if (!validate.success) return { match: false };

      return {
        match: true,
        args: [
          {
            collections: collections as Space[],
          },
        ],
      };
    };

    return new Promise((resolve, reject) => {
      const removeInterceptor = webpageMessenger.addInterceptor({
        matchCondition,
        async callback(messageData, args) {
          resolve(args[0].collections);
          return messageData;
        },
        stopCondition: (messageData) => matchCondition(messageData).match,
      });

      setTimeout(() => {
        removeInterceptor();
        reject(new Error("Fetching spaces timed out"));
      }, 3000);
    });
  }

  static waitForSpaceCreation() {
    const matchCondition = (messageData: MessageData<any>) => {
      const parsedPayload = parseStructuredMessage(messageData);

      if (!parsedPayload) return false;

      return !(
        parsedPayload.messageCode !== 430 &&
        parsedPayload.data?.length === 1 &&
        parsedPayload.data[0].status === "completed" &&
        "title" in parsedPayload.data[0] &&
        "description" in parsedPayload.data[0] &&
        "instructions" in parsedPayload.data[0]
      );
    };

    return new Promise((resolve, reject) => {
      const removeInterceptor = webpageMessenger.addInterceptor({
        matchCondition: (messageData: MessageData<any>) => {
          return { match: matchCondition(messageData) };
        },
        callback: async (messageData: MessageData<any>) => {
          resolve(null);
          return messageData;
        },
        stopCondition: (messageData) => matchCondition(messageData), // stop after the first match
      });

      setTimeout(() => {
        removeInterceptor();
        reject(new Error("Space creation timed out"));
      }, 5000);
    });
  }
}

function parseStructuredMessage(messageData: MessageData<unknown>) {
  const webSocketMessageData = messageData as MessageData<
    WebSocketEventData | LongPollingEventData
  >;

  const parsedPayload = WsMessageParser.parse(
    webSocketMessageData.payload.payload,
  );

  if (!isParsedWsMessage(parsedPayload)) return null;

  return parsedPayload;
}
