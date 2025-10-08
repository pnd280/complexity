// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EventHandlers {}

type EventHandlerParams<T extends keyof EventHandlers> =
  EventHandlers[T] extends () => unknown
    ? undefined
    : EventHandlers[T] extends (params: infer P) => unknown
      ? P
      : never;

type EventHandlerReturn<T extends keyof EventHandlers> =
  EventHandlers[T] extends (...args: unknown[]) => infer R ? R : void;

export type TypedMessage<T extends keyof EventHandlers = keyof EventHandlers> =
  EventHandlerParams<T> extends undefined
    ? { type: T }
    : { type: T; data: EventHandlerParams<T> };

export type TypedSendResponse<T extends keyof EventHandlers> = (
  response: EventHandlerReturn<T>,
) => void;

export type BrowserRuntimeEvents = keyof EventHandlers extends infer K
  ? K extends keyof EventHandlers
    ? TypedMessage<K>
    : never
  : never;

export function onMessage(handlers: {
  [K in keyof EventHandlers]?: (
    message: TypedMessage<K>,
    sender: chrome.runtime.MessageSender,
  ) => EventHandlerReturn<K>;
}): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const handler = handlers[message.type as keyof typeof handlers];
    if (handler != null) {
      try {
        sendResponse(handler(message, sender));
      } catch (error) {
        console.error("Error handling message:", error);
        sendResponse(undefined);
        return true;
      }
    }
    return false;
  });
}

export function sendMessage<K extends keyof EventHandlers>(
  type: K,
  ...args: EventHandlerParams<K> extends undefined
    ? []
    : [data: EventHandlerParams<K>]
): Promise<EventHandlerReturn<K>> {
  return new Promise((resolve, reject) => {
    const message = args.length > 0 ? { type, data: args[0] } : { type };

    chrome.runtime.sendMessage(message as BrowserRuntimeEvents, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}
