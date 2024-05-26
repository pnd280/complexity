import {
  LongPollingEventData,
  MessageData,
  WebSocketEventData,
} from '@/types/WebpageMessenger';
import { TrackQueryLimits } from '@/types/WebpageMessengerInterceptors';
import {
  isParsedWSMessage,
  WSParsedMessage,
} from '@/types/WS';
import { WSMessageParser } from '@/utils/ws';

import { queryBoxStore } from '../session-store/query-box';
import { webpageMessenger } from './messenger';

function trackQueryLimits() {
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
            isRateLimitRequest || isOpusRateLimitRequest || isRateLimitResponse,
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
          parsedPayload.messageCode - 10 === getRateLimitIdentifier.rateLimit ||
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

function inspectWebSocketEvents() {
  webpageMessenger.addInterceptor({
    matchCondition: (messageData) => {
      if (messageData.event !== 'webSocketEvent') return { match: false };

      const webSocketMessageData =
        messageData as MessageData<WebSocketEventData>;

      return {
        match:
          webSocketMessageData.event === 'webSocketEvent' &&
          webSocketMessageData.payload.event === 'message',
      };
    },
    callback: async (messageData: MessageData<WebSocketEventData>) => {
      console.log('web socket:', messageData.payload.payload);
      return messageData;
    },
    stopCondition: () => false,
  });
}

function inspectLongPollingEvents() {
  webpageMessenger.addInterceptor({
    matchCondition: (messageData) => {
      const webSocketMessageData =
        messageData as MessageData<LongPollingEventData>;

      return {
        match: webSocketMessageData.event === 'longPollingEvent',
      };
    },
    callback: async (messageData: MessageData<LongPollingEventData>) => {
      console.log('long polling:', messageData.payload.payload);
      return messageData;
    },
    stopCondition: () => false,
  });
}

function alterQuery() {
  webpageMessenger.addInterceptor({
    matchCondition: (messageData: MessageData<any>) => {
      const webSocketMessageData = messageData as MessageData<
        WebSocketEventData | LongPollingEventData
      >;

      const parsedPayload: WSParsedMessage | null | string =
        WSMessageParser.parse(webSocketMessageData.payload.payload);

      if (!isParsedWSMessage(parsedPayload)) return { match: false };

      parsedPayload.data[1] = {
        ...parsedPayload.data[1],
        model_preference: queryBoxStore.getState().selectedLanguageModel,
        search_focus: queryBoxStore.getState().webAccess.allowWebAccess
          ? queryBoxStore.getState().webAccess.focus
          : 'writing',
        mode:
          queryBoxStore.getState().webAccess.proSearch &&
          queryBoxStore.getState().webAccess.allowWebAccess
            ? 'copilot'
            : 'concise',
      };

      return {
        match:
          parsedPayload.event === 'perplexity_ask' &&
          parsedPayload.data?.[1].query_source !== 'retry',
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

const webpageMessageInterceptors = {
  trackQueryLimits,
  inspectWebSocketEvents,
  inspectLongPollingEvents,
  alterQuery,
};

export default webpageMessageInterceptors;
