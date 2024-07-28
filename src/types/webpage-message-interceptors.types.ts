import {
  AddInterceptorMatchCondition,
  WebSocketEventData,
} from "@/types/webpage-messenger.types";
import { WSParsedMessage } from "@/types/ws.types";

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
