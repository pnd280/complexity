import {
  AddInterceptorMatchCondition,
  WebSocketEventData,
} from "@/types/webpage-messenger.types";
import { WsParsedMessage } from "@/types/ws.types";

export type TrackQueryLimits = AddInterceptorMatchCondition<
  WebSocketEventData,
  {
    getRateLimitIdentifier: {
      rateLimit: number;
      opusRateLimit: number;
    };
    parsedPayload: WsParsedMessage;
    isRateLimitRequest: boolean;
    isOpusRateLimitRequest: boolean;
    isRateLimitResponse: boolean;
  }
>;
