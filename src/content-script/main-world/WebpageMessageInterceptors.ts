import { LanguageModel } from '@/types/ModelSelector';
import {
  LongPollingEventData,
  MessageData,
  WebSocketEventData,
} from '@/types/WebpageMessenger';
import { TrackQueryLimits } from '@/types/WebpageMessengerInterceptors';
import { isParsedWSMessage, WSParsedMessage } from '@/types/WS';
import WSMessageParser from '@/utils/WSMessageParser';

import { popupSettingsStore } from '../session-store/popup-settings';
import { queryBoxStore } from '../session-store/query-box';
import { webpageMessenger } from './webpage-messenger';

export default class WebpageMessageInterceptor {
  static updateQueryLimits() {
    webpageMessenger.addInterceptor({
      matchCondition: ((): TrackQueryLimits => {
        const getRateLimitIdentifier = {
          rateLimit: 0,
          opusRateLimit: 0,
        };

        return (messageData) => {
          const parsedPayload: WSParsedMessage | null | string =
            WSMessageParser.parse(messageData.payload.payload);

          if (!isParsedWSMessage(parsedPayload)) return { match: false };

          const isRateLimitRequest = parsedPayload.event === 'get_rate_limit';

          const isOpusRateLimitRequest =
            parsedPayload.event === 'get_opus_rate_limit';

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

            console.log('queryLimit:', parsedPayload.data[0].remaining);
          } else if (
            parsedPayload.messageCode - 10 ===
              getRateLimitIdentifier.opusRateLimit ||
            parsedPayload.messageCode - 100 ===
              getRateLimitIdentifier.opusRateLimit
          ) {
            queryBoxStore.setState({
              opusLimit: parsedPayload.data[0].remaining,
            });

            console.log('opusLimit:', parsedPayload.data[0].remaining);
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
        if (messageData.event !== 'webSocketEvent') return { match: false };

        const webSocketMessageData =
          messageData as MessageData<WebSocketEventData>;

        return {
          match: webSocketMessageData.event === 'webSocketEvent',
        };
      },
      callback: async (messageData: MessageData<WebSocketEventData>) => {
        console.log('web socket:', messageData.payload.payload);
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
          match: webSocketMessageData.event === 'longPollingEvent',
        };
      },
      callback: async (messageData: MessageData<LongPollingEventData>) => {
        console.log('long polling:', messageData.payload);
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

        const parsedPayload: WSParsedMessage | null | string =
          WSMessageParser.parse(webSocketMessageData.payload.payload);

        if (!isParsedWSMessage(parsedPayload)) return { match: false };

        if (parsedPayload.event !== 'perplexity_ask') {
          return { match: false };
        }

        if (parsedPayload.data[1].query_source === 'default_search') {
          return { match: false };
        }

        const newModelPreference =
          popupSettingsStore.getState().queryBoxSelectors.languageModel &&
          parsedPayload.data?.[1].query_source !== 'retry'
            ? queryBoxStore.getState().selectedLanguageModel
            : parsedPayload.data[1].model_preference;

        const newSearchFocus = popupSettingsStore.getState().queryBoxSelectors
          .focus
          ? queryBoxStore.getState().webAccess.allowWebAccess
            ? queryBoxStore.getState().webAccess.focus
            : 'writing'
          : parsedPayload.data[1].search_focus;

        const newTargetCollectionUuid = popupSettingsStore.getState()
          .queryBoxSelectors.collection
          ? parsedPayload.data[1].query_source === 'home' ||
            parsedPayload.data[1].query_source === 'modal'
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
          match: parsedPayload.event === 'perplexity_ask',
          args: [
            {
              newPayload: WSMessageParser.stringify(parsedPayload),
            },
          ],
        };
      },
      callback: async (
        messageData: MessageData<WebSocketEventData | LongPollingEventData>,
        args
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
    languageModel: LanguageModel['code'];
    proSearchState?: boolean;
  }) {
    return webpageMessenger.addInterceptor({
      matchCondition: (messageData: MessageData<any>) => {
        const webSocketMessageData = messageData as MessageData<
          WebSocketEventData | LongPollingEventData
        >;

        const parsedPayload: WSParsedMessage | null | string =
          WSMessageParser.parse(webSocketMessageData.payload.payload);

        if (!isParsedWSMessage(parsedPayload)) return { match: false };

        if (parsedPayload.event !== 'perplexity_ask') {
          return { match: false };
        }

        parsedPayload.data[1] = {
          ...parsedPayload.data[1],
          model_preference: languageModel,
          mode: proSearchState ? 'copilot' : parsedPayload.data[1].mode,
          search_focus: proSearchState
            ? queryBoxStore.getState().webAccess.focus
            : parsedPayload.data[1].search_focus,
        };

        return {
          match:
            parsedPayload.event === 'perplexity_ask' &&
            parsedPayload.data?.[1].query_source === 'retry',
          args: [
            {
              newPayload: WSMessageParser.stringify(parsedPayload),
            },
          ],
        };
      },
      callback: async (
        messageData: MessageData<WebSocketEventData | LongPollingEventData>,
        args
      ) => {
        return { ...messageData, payload: { payload: args[0].newPayload } };
      },
      stopCondition: () => true,
    });
  }

  static removeComplexityIdentifier() {
    webpageMessenger.addInterceptor({
      matchCondition: (messageData: MessageData<any>) => {
        const webSocketMessageData = messageData as MessageData<
          WebSocketEventData | LongPollingEventData
        >;

        const parsedPayload: WSParsedMessage | null | string =
          WSMessageParser.parse(webSocketMessageData.payload.payload);

        if (!isParsedWSMessage(parsedPayload)) return { match: false };

        const match = parsedPayload.data?.[0]?.is_complexity;

        if (parsedPayload.data?.[0]?.is_complexity) {
          parsedPayload.data[0].is_complexity = undefined;
        }

        return {
          match,
          args: [{ newPayload: WSMessageParser.stringify(parsedPayload) }],
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
        parsedPayload.data[0].status === 'completed'
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

  static waitForUserProfileSettings() {
    const matchCondition = (messageData: MessageData<any>) => {
      const parsedPayload: WSParsedMessage | null =
        WebpageMessageInterceptor.parseStructuredMessage(messageData);

      if (!parsedPayload) return false;

      if (parsedPayload.messageCode !== 431) return false;

      if (parsedPayload.data?.length !== 1) return false;

      return (
        'has_profile' in parsedPayload.data[0] && 'bio' in parsedPayload.data[0]
      );
    };

    return new Promise((resolve) => {
      webpageMessenger.addInterceptor({
        matchCondition: (messageData: MessageData<any>) => {
          return { match: matchCondition(messageData) };
        },
        callback: async (messageData: MessageData<any>) => {
          resolve(messageData.payload);
          return messageData;
        },
        stopCondition: (messageData) => matchCondition(messageData), // stop after the first match
      });
    });
  }

  static blockTelemetry() {
    if (!popupSettingsStore.getState().qolTweaks.blockTelemetry) return;

    webpageMessenger.addInterceptor({
      matchCondition: (messageData: MessageData<any>) => {
        const webSocketMessageData = messageData as MessageData<
          WebSocketEventData | LongPollingEventData
        >;

        const parsedPayload: WSParsedMessage | null | string =
          WSMessageParser.parse(webSocketMessageData.payload.payload);

        if (!isParsedWSMessage(parsedPayload)) return { match: false };

        return {
          match: parsedPayload.event === 'analytics_event',
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

    const parsedPayload: WSParsedMessage | null | string =
      WSMessageParser.parse(webSocketMessageData.payload.payload);

    if (!isParsedWSMessage(parsedPayload)) return null;

    return parsedPayload;
  }
}
