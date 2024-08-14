import {
  LanguageModel,
  WebAccessFocus,
} from "@/content-script/components/QueryBox";
import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { queryBoxStore } from "@/content-script/session-store/query-box";
import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import { Collection, CollectionSchema } from "@/types/collection.types";
import {
  CollectionsApiResponse,
  UserAiProfileApiResponse,
} from "@/types/pplx-api.types";
import { UserAiProfile, UserAiProfileSchema } from "@/types/user-ai-profile";
import { TrackQueryLimits } from "@/types/webpage-message-interceptors.types";
import {
  AddInterceptorMatchCondition,
  LongPollingEventData,
  MessageData,
  WebSocketEventData,
} from "@/types/webpage-messenger.types";
import { isParsedWsMessage, WsParsedMessage } from "@/types/ws.types";
import WsMessageParser from "@/utils/WsMessageParser";

export default class WebpageMessageInterceptor {
  static updateQueryLimits() {
    webpageMessenger.addInterceptor({
      matchCondition: ((): TrackQueryLimits => {
        const getRateLimitIdentifier = {
          rateLimit: 0,
          opusRateLimit: 0,
        };

        return (messageData) => {
          const parsedPayload: WsParsedMessage | null | string =
            WsMessageParser.parse(messageData.payload.payload);

          if (!isParsedWsMessage(parsedPayload)) return { match: false };

          const isRateLimitRequest = parsedPayload.event === "get_rate_limit";

          const isOpusRateLimitRequest =
            parsedPayload.event === "get_opus_rate_limit";

          const isRateLimitResponse =
            Array.isArray(parsedPayload.data) &&
            parsedPayload.data?.[0]?.remaining;

          return {
            match:
              isRateLimitRequest ||
              isOpusRateLimitRequest ||
              isRateLimitResponse,
            args: [
              {
                getRateLimitIdentifier,
                parsedPayload,
                isRateLimitRequest,
                isOpusRateLimitRequest,
                isRateLimitResponse,
              },
            ],
          };
        };
      })(),
      callback: async (messageData, args) => {
        const {
          getRateLimitIdentifier,
          parsedPayload,
          isRateLimitRequest,
          isOpusRateLimitRequest,
          isRateLimitResponse,
        } = args[0];

        if (isRateLimitRequest) {
          getRateLimitIdentifier.rateLimit = parsedPayload.messageCode;
        }

        if (isOpusRateLimitRequest) {
          getRateLimitIdentifier.opusRateLimit = parsedPayload.messageCode;
        }

        if (isRateLimitResponse) {
          if (
            parsedPayload.messageCode - 10 ===
              getRateLimitIdentifier.rateLimit ||
            parsedPayload.messageCode - 100 === getRateLimitIdentifier.rateLimit
          ) {
            queryBoxStore.setState({
              queryLimit: parsedPayload.data[0].remaining,
            });

            console.log("queryLimit:", parsedPayload.data[0].remaining);
          } else if (
            parsedPayload.messageCode - 10 ===
              getRateLimitIdentifier.opusRateLimit ||
            parsedPayload.messageCode - 100 ===
              getRateLimitIdentifier.opusRateLimit
          ) {
            queryBoxStore.setState({
              opusLimit: parsedPayload.data[0].remaining,
            });

            console.log("opusLimit:", parsedPayload.data[0].remaining);
          }
        }

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

        const newModelPreference =
          CplxUserSettings.get().generalSettings.queryBoxSelectors
            .languageModel && parsedPayload.data?.[1].query_source !== "retry"
            ? queryBoxStore.getState().selectedLanguageModel
            : parsedPayload.data[1].model_preference;

        const newSearchFocus = CplxUserSettings.get().generalSettings
          .queryBoxSelectors.focus
          ? queryBoxStore.getState().webAccess.allowWebAccess
            ? queryBoxStore.getState().webAccess.focus
            : "writing"
          : parsedPayload.data[1].search_focus;

        const newTargetCollectionUuid = CplxUserSettings.get().generalSettings
          .queryBoxSelectors.collection
          ? parsedPayload.data[1].query_source === "home" ||
            parsedPayload.data[1].query_source === "modal"
            ? queryBoxStore.getState().selectedCollectionUuid
            : parsedPayload.data[1].target_collection_uuid
          : undefined;

        parsedPayload.data[1] = {
          ...parsedPayload.data[1],
          model_preference: newModelPreference,
          search_focus: newSearchFocus,
          target_collection_uuid: newTargetCollectionUuid,
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
    focus,
  }: {
    languageModel?: LanguageModel["code"];
    proSearchState?: boolean;
    focus?: WebAccessFocus["code"];
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

        const { webAccess } = queryBoxStore.getState();

        const newFocus = proSearchState
          ? webAccess.focus
          : (focus ?? (webAccess.allowWebAccess ? webAccess.focus : "writing"));

        parsedPayload.data[1] = {
          ...parsedPayload.data[1],
          model_preference: languageModel,
          mode: proSearchState ? "copilot" : parsedPayload.data[1].mode,
          search_focus: newFocus,
          redo_search: newFocus === "writing" ? true : undefined,
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

  static waitForUpsertThreadCollection() {
    const matchCondition = (messageData: MessageData<any>) => {
      const parsedPayload =
        WebpageMessageInterceptor.parseStructuredMessage(messageData);

      if (!parsedPayload) return false;

      return !(
        parsedPayload.messageCode !== 431 &&
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
        WebpageMessageInterceptor.parseStructuredMessage(messageData);

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

  static waitForCollections(): Promise<Collection[]> {
    const matchCondition: AddInterceptorMatchCondition<
      any,
      { collections: any[] }
    > = (messageData) => {
      const parsedPayload: WsParsedMessage | null =
        WebpageMessageInterceptor.parseStructuredMessage(messageData);

      if (!parsedPayload) return { match: false };

      if (parsedPayload.messageCode !== 431) return { match: false };

      if (
        parsedPayload.data?.length !== 1 ||
        !Array.isArray(parsedPayload.data[0]) ||
        parsedPayload.data[0].length <= 0
      )
        return { match: false };

      const collections = parsedPayload.data[0] as CollectionsApiResponse;

      const validate = CollectionSchema.safeParse(collections[0]);

      if (!validate.success) return { match: false };

      return {
        match: true,
        args: [
          {
            collections: collections as Collection[],
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
        reject(new Error("Fetching collections timed out"));
      }, 5000);
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

  static parseStructuredMessage(messageData: MessageData<any>) {
    const webSocketMessageData = messageData as MessageData<
      WebSocketEventData | LongPollingEventData
    >;

    const parsedPayload: WsParsedMessage | null | string =
      WsMessageParser.parse(webSocketMessageData.payload.payload);

    if (!isParsedWsMessage(parsedPayload)) return null;

    return parsedPayload;
  }
}
