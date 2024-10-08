import { LanguageModel, FocusMode } from "@/content-script/components/QueryBox";
import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { queryBoxStore } from "@/content-script/session-store/query-box";
import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import { Collection, CollectionSchema } from "@/types/collection.types";
import {
  CollectionsApiResponse,
  UserAiProfileApiResponse,
} from "@/types/pplx-api.types";
import { UserAiProfile, UserAiProfileSchema } from "@/types/user-ai-profile";
import {
  AddInterceptorMatchCondition,
  LongPollingEventData,
  MessageData,
  WebSocketEventData,
} from "@/types/webpage-messenger.types";
import {
  isParsedWsMessage,
  isWebSocketEventData,
  WsParsedMessage,
} from "@/types/ws.types";
import { DomHelperSelectors, DomSelectors } from "@/utils/DomSelectors";
import { queryClient } from "@/utils/ts-query-query-client";
import UiUtils from "@/utils/UiUtils";
import { jsonUtils, waitForElement, whereAmI } from "@/utils/utils";
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

        if (parsedPayload.data[1].ignore_interceptor === true) {
          return { match: false };
        }

        const newModelPreference =
          CplxUserSettings.get().generalSettings.queryBoxSelectors
            .languageModel && parsedPayload.data?.[1].query_source !== "retry"
            ? queryBoxStore.getState().selectedLanguageModel
            : parsedPayload.data[1].model_preference;

        const newSearchFocus = CplxUserSettings.get().generalSettings
          .queryBoxSelectors.focus
          ? queryBoxStore.getState().focusMode
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
    focus?: FocusMode["code"];
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

        const { focusMode } = queryBoxStore.getState();

        const newFocus = proSearchState ? focusMode : (focus ?? focusMode);

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

  static autoRenameThread() {
    const prompt = `
# IDENTITY and PURPOSE

You are an expert content summarizer. Your task is to generate a concise, one-line title that captures the essence of the provided text.

## STEPS

- Synthesize your understanding of the text into a single title consisting of 3-10 words, optionally starting with an emoji.
- Ensure the title is straightforward and easy to comprehend.
- The title should reflect the main topic, task, or purpose of the text.

## OUTPUT INSTRUCTIONS

- Provide the title in plain text without any special characters or Markdown formatting.
- Respond strictly with the title; do not include any additional text or context.
- The title must be in the same language as the original text.

## THE TEXT:
`;

    if (
      !CplxUserSettings.get().generalSettings.qolTweaks.autoGenerateThreadTitle
    )
      return;

    webpageMessenger.addInterceptor({
      matchCondition: (messageData: MessageData<unknown>) => {
        if (!isWebSocketEventData(messageData)) return { match: false };

        if (messageData.payload.isInternal) {
          return { match: false };
        }

        const parsedPayload = parseStructuredMessage(messageData);

        if (!parsedPayload) return { match: false };

        if (parsedPayload.data[0]?.length < 1) return { match: false };

        const { status, query_str, privacy_state } = parsedPayload.data[0];

        if (status !== "completed" || privacy_state === "INCOGNITO")
          return { match: false };

        if (query_str == null) return { match: false };

        return {
          match: true,
          args: [
            {
              queryStr: query_str,
            },
          ],
        };
      },
      callback: async (messageData, args) => {
        if (whereAmI() !== "thread") return messageData;

        if ($(DomHelperSelectors.THREAD.MESSAGE.BLOCK).length > 1)
          return messageData;

        const queryStr = args[0].queryStr;

        webpageMessenger.sendMessage({
          event: "sendWebSocketMessage",
          payload: WsMessageParser.stringify({
            messageCode: 420,
            event: "perplexity_ask",
            data: [
              prompt + queryStr,
              {
                version: "2.12",
                source: "default",
                language: "en-US",
                search_focus: "writing",
                mode: "concise",
                model_preference: "turbo" as LanguageModel["code"],
                is_incognito: true,
                ignore_interceptor: true,
              },
            ],
          }),
          timeout: 10000,
        });

        const title =
          await WebpageMessageInterceptor.waitForThreadNameGeneration({
            queryStr: prompt + queryStr,
          });

        if (!title) return messageData;

        const div = await waitForElement({
          selector: DomSelectors.SICKY_NAVBAR_CHILD.THREAD_TITLE,
          timeout: 1000,
        });

        if (div == null) return messageData;

        $(DomSelectors.SICKY_NAVBAR_CHILD.THREAD_TITLE_WRAPPER).css({
          opacity: 0,
        });

        (div as HTMLElement).click();

        const input = await waitForElement({
          selector: DomSelectors.SICKY_NAVBAR_CHILD.THREAD_TITLE_INPUT,
          timeout: 1000,
        });

        if (input == null) return messageData;

        UiUtils.setReactInputValue(input as HTMLInputElement, title);

        $(input).trigger("blur");

        $(DomSelectors.SICKY_NAVBAR_CHILD.THREAD_TITLE_WRAPPER).css({
          opacity: 100,
        });

        return messageData;
      },
      stopCondition: () => false,
    });
  }

  static waitForUpsertThreadCollection() {
    const matchCondition = (messageData: MessageData<any>) => {
      const parsedPayload = parseStructuredMessage(messageData);

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

  static waitForCollections(): Promise<Collection[]> {
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
      }, 3000);
    });
  }

  static waitForThreadNameGeneration({
    queryStr,
  }: {
    queryStr: string;
  }): Promise<string> {
    const matchCondition: AddInterceptorMatchCondition<
      any,
      { content: string }
    > = (messageData) => {
      if (!isWebSocketEventData(messageData)) return { match: false };

      if (!messageData.payload.isInternal) return { match: false };

      const parsedPayload: WsParsedMessage | null =
        parseStructuredMessage(messageData);
      if (
        !parsedPayload ||
        parsedPayload.messageCode !== 430 ||
        parsedPayload.event !== "" ||
        parsedPayload.data[0].status !== "completed" ||
        parsedPayload.data[0].query_str.trim() !== queryStr.trim()
      ) {
        return { match: false };
      }

      return {
        match: true,
        args: [
          {
            content: jsonUtils.safeParse(parsedPayload.data[0].text).answer,
          },
        ],
      };
    };

    return new Promise((resolve, reject) => {
      const removeInterceptor = webpageMessenger.addInterceptor({
        matchCondition,
        async callback(messageData, args) {
          resolve(args[0].content);
          return messageData;
        },
        stopCondition: (messageData) => matchCondition(messageData).match,
      });

      setTimeout(() => {
        removeInterceptor();
        reject(new Error("Fetching thread name generation timed out"));
      }, 3000);
    });
  }

  static waitForCollectionCreation() {
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
        reject(new Error("Collection creation timed out"));
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
