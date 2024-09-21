import { HTMLCanvasAction } from "@/content-script/main-world/canvas/html";
import { ReactNodeAction } from "@/content-script/main-world/react-node";
import { Nullable } from "@/types/utils.types";
import { RouterEvent } from "@/types/ws.types";

export type MessageData<T> = {
  messageId: string;
  event: keyof EventHandlers;
  payload: T;
  namespace: "complexity";
  forceLongPolling?: boolean;
};

export type SendMessageOptions<K extends keyof EventHandlers> = {
  event: K;
  payload?: EventPayloads[K];
  forceLongPolling?: boolean;
  suppressTimeoutError?: boolean;
};

export type ResponseData<T> = {
  event: "response";
  payload: T;
  messageId: string;
  namespace: "complexity";
};

export type ResponseOptions<T> = Omit<ResponseData<T>, "event" | "namespace">;

export type EventPayloads = {
  [K in keyof EventHandlers]: Parameters<EventHandlers[K]>[0] extends undefined
    ? void
    : Parameters<EventHandlers[K]>[0];
};

export type SendMessage = <K extends keyof EventHandlers>(
  options: SendMessageOptions<K>,
) => Promise<ReturnType<EventHandlers[K]>>;

export type MessageListener = <K extends keyof EventHandlers>(
  eventName: K,
  callback: (
    messageData: MessageData<EventPayloads[K]>,
  ) => Promise<ReturnType<EventHandlers[K]>>,
) => void;

export type WebSocketEventData = {
  event: "send" | "open" | "message" | "close";
  payload: any;
};

export type LongPollingEventData = {
  event: "request" | "response";
  payload: any;
};

export type AddInterceptorMatchCondition<T, K> = (
  messageData: MessageData<T>,
) => {
  match: boolean;
  args?: K[];
};

export type AddInterceptorParams<K extends keyof EventHandlers, T, J> = {
  matchCondition: AddInterceptorMatchCondition<T, J>;
  callback: (
    messageData: MessageData<T>,
    args: J[],
  ) => Promise<ReturnType<EventHandlers[K]>>;
  stopCondition: (messageData: MessageData<T>) => boolean;
  timeout?: number;
  stopPropagation?: boolean;
};

export type Interceptor<
  K extends keyof EventHandlers,
  T,
  J,
> = AddInterceptorParams<K, T, J> & {
  identifier: string;
};

export interface EventHandlers {
  log(data: string): string;

  sendWebSocketMessage(data: string): void;
  webSocketEvent(data: WebSocketEventData): WebSocketEventData["payload"];
  longPollingEvent(data: LongPollingEventData): LongPollingEventData["payload"];
  isWebSocketCaptured(): boolean;
  isInternalWebSocketInitialized(): boolean;
  getActiveWebSocketType(): Nullable<"WebSocket" | "Long-polling">;
  webSocketError(data: Event): void;

  routeToPage(
    data:
      | string
      | {
          url: string;
          scroll: boolean;
        },
  ): void;
  routeChange({ url, trigger }: { url: string; trigger: RouterEvent }): void;

  isShikiHighlighterInitialized(): boolean;
  getHighlightedCodeAsHtml({
    code,
    lang,
  }: {
    code: string;
    lang: string;
  }): Nullable<string>;

  isMermaidInitialized(): boolean;
  mermaidCanvasAction({
    action,
    payload,
  }: {
    action: "render" | "resetZoomPan";
    payload: string;
  }): boolean;

  htmlCanvasAction({ action, payload }: HTMLCanvasAction): boolean;

  getReactNodeData({
    querySelector,
    action,
  }: {
    querySelector: string;
    action: ReactNodeAction;
  }): unknown;
}
