import {
  AddInterceptorMatchCondition,
  WebSocketEventData,
} from "./webpage-messenger.types";
import { WSParsedMessage } from "./ws.types";

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
