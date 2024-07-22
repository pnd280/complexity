import {
  AddInterceptorParams,
  EventHandlers,
  EventPayloads,
  Interceptor,
  LongPollingEventData,
  MessageData,
  ResponseData,
  SendMessageOptions,
  WebSocketEventData,
} from "@/types/WebpageMessenger";
import { extensionExec } from "@/utils/hof";
import { isMainWorldContext } from "@/utils/utils";

class WebpageMessenger {
  public static instance: WebpageMessenger;

  private interceptors: Interceptor<any, any, any>[] = [];

  private registeredEventListeners: Record<
    string,
    (event: MessageEvent) => any
  >[] = [];

  private constructor() {}

  static getInstance() {
    if (!WebpageMessenger.instance) {
      WebpageMessenger.instance = new WebpageMessenger();
    }

    return WebpageMessenger.instance;
  }

  private trackListeners(
    eventName: string,
    listener: (event: MessageEvent) => any,
  ) {
    this.registeredEventListeners.push({
      [eventName]: listener,
    });
  }

  private getTrackedListeners() {
    return this.registeredEventListeners;
  }

  setupContentScriptListeners() {
    this.onMessage("webSocketEvent", async (messageData) => {
      const newMessageData = (await this.executeInterceptors(
        messageData,
      )) as MessageData<WebSocketEventData>;

      return newMessageData?.payload.payload;
    });

    this.onMessage("longPollingEvent", async (messageData) => {
      const newMessageData = (await this.executeInterceptors(
        messageData,
      )) as MessageData<LongPollingEventData>;

      return newMessageData?.payload.payload;
    });
  }

  private async executeInterceptors(
    messageData: MessageData<WebSocketEventData | LongPollingEventData>,
  ) {
    let newMessageData = messageData;

    for (let i = 0; i < this.interceptors.length; i++) {
      const interceptor = this.interceptors[i];

      const { match, args } = interceptor.matchCondition(newMessageData);

      if (match) {
        const responsePayload = await interceptor.callback(
          newMessageData,
          args || [],
        );

        if (interceptor.stopCondition(newMessageData)) {
          const myInterceptorId = interceptor.identifier;

          this.interceptors = this.interceptors.filter(
            (interceptor) => interceptor.identifier !== myInterceptorId,
          );
        }

        if (responsePayload === null) {
          return null;
        }

        newMessageData = responsePayload;
      }
    }

    return newMessageData;
  }

  sendMessage<
    K extends keyof EventHandlers,
    T extends number | undefined = undefined,
  >({
    event,
    payload,
    timeout,
    forceLongPolling = false,
    suppressTimeoutError = false,
  }: SendMessageOptions<K> & { timeout?: T }): T extends undefined | 0
    ? never
    : Promise<ReturnType<EventHandlers[K]>> {
    return new Promise((resolve, reject) => {
      const uniqueId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      const message: MessageData<EventPayloads[K]> = {
        event,
        messageId: uniqueId,
        forceLongPolling,
        payload: payload as EventPayloads[K],
        namespace: "complexity",
      };

      window.postMessage(message, window.location.origin);

      if (timeout && timeout > 0) {
        const listener = (event: MessageEvent) => {
          const messageData: ResponseData<ReturnType<EventHandlers[K]>> =
            event.data;

          if (
            messageData &&
            messageData.event === "response" &&
            messageData.namespace === "complexity" &&
            messageData.messageId === uniqueId
          ) {
            window.removeEventListener("message", listener);
            resolve(messageData.payload);
          }
        };

        window.addEventListener("message", listener);

        setTimeout(() => {
          window.removeEventListener("message", listener);

          if (suppressTimeoutError) {
            return resolve({} as ReturnType<EventHandlers[K]>);
          }

          reject({
            error: "Response timeout",
            event,
          });
        }, timeout);
      }
    }) as any; // Type assertion needed due to conditional return type
  }

  onMessage<K extends keyof EventHandlers>(
    eventName: K,
    callback: (
      messageData: MessageData<EventPayloads[K]>,
    ) => Promise<ReturnType<EventHandlers[K]>>,
  ) {
    switch (eventName) {
      case "webSocketEvent":
      case "longPollingEvent":
        if (
          this.getTrackedListeners().some((listener) => listener[eventName])
        ) {
          return;
        }

        break;
      default:
    }

    const listeners = async (event: MessageEvent) => {
      const messageData: MessageData<EventPayloads[K]> = event.data;

      if (event.origin !== window.location.origin) {
        return;
      }

      if (
        messageData?.event !== eventName ||
        messageData.namespace !== "complexity"
      ) {
        return;
      }

      const responsePayload = await callback(messageData);
      const responseMessage: ResponseData<ReturnType<EventHandlers[K]>> = {
        event: "response",
        namespace: "complexity",
        messageId: messageData.messageId,
        payload: responsePayload,
      };

      window.postMessage(responseMessage, window.location.origin);
    };

    window.addEventListener("message", listeners);

    const instance = isMainWorldContext() ? WebpageMessenger.instance : this;

    instance.trackListeners(eventName, listeners);

    return () => {
      window.removeEventListener("message", listeners);
    };
  }

  addInterceptor<K extends keyof EventHandlers, T, J>({
    matchCondition,
    callback,
    stopCondition,
  }: AddInterceptorParams<K, T, J>) {
    const identifier = `interceptor_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    this.interceptors.push({
      matchCondition,
      callback,
      stopCondition,
      identifier,
    });

    const removeInterceptor = () => {
      this.interceptors = this.interceptors.filter(
        (interceptor) => interceptor.identifier !== identifier,
      );
    };

    return removeInterceptor;
  }
}

const webpageMessenger = WebpageMessenger.getInstance();

extensionExec(() => webpageMessenger.setupContentScriptListeners())();

export { webpageMessenger };
