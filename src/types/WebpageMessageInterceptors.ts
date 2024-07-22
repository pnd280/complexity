import {
  AddInterceptorMatchCondition,
  WebSocketEventData,
} from "./WebpageMessenger";
import { WSParsedMessage } from "./WS";

export type TrackQueryLimits = AddInterceptorMatchCondition<
  WebSocketEventData,
  {
    getRateLimitIdentifier: {
      rateLimit: number;
      opusRateLimit: number;
    };
    parsedPayload: WSParsedMessage;
    isRateLimitRequest: boolean;
    isOpusRateLimitRequest: boolean;
    isRateLimitResponse: boolean;
  }
>;
