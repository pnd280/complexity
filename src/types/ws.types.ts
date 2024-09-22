import {
  MessageData,
  WebSocketEventData,
} from "@/types/webpage-messenger.types";

export type WsParsedMessage = {
  messageCode: number;
  event: string;
  data: any[] | any;
};
export type RouterEvent =
  | "push"
  | "replace"
  | "popstate"
  | "routeChangeComplete";

export function isParsedWsMessage(data: unknown): data is WsParsedMessage {
  return data != null && typeof data === "object" && "messageCode" in data;
}

export function isWebSocketEventData(
  data: unknown,
): data is MessageData<WebSocketEventData> {
  return (
    data != null &&
    typeof data === "object" &&
    "event" in data &&
    data.event === "webSocketEvent"
  );
}
