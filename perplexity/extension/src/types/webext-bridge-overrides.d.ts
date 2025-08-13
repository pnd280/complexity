import type { BridgeMessage } from "webext-bridge";

import type { MaybePromise } from "@/types/utils.types";

interface EventHandlers {
  placeholder: never;
}

type MessageFunctions = {
  onMessage<K extends keyof EventHandlers>(
    event: K,
    callback: (
      data: Parameters<EventHandlers[K]>[0] extends undefined
        ? Omit<BridgeMessage<EventHandlers[K]>, "data">
        : BridgeMessage<EventHandlers[K]> & {
            data: Parameters<EventHandlers[K]>[0];
          },
    ) => MaybePromise<ReturnType<EventHandlers[K]>>,
  ): () => void;

  sendMessage<K extends keyof EventHandlers>(
    event: K,
    payload: Parameters<EventHandlers[K]>[0],
    target:
      | "content-script"
      | "background"
      | "popup"
      | "options"
      | "window"
      | `content-script@${number}`
      | `devtools@${number}`,
  ): Promise<ReturnType<EventHandlers[K]>>;
};

declare module "webext-bridge/content-script" {
  export const onMessage: MessageFunctions["onMessage"];
  export const sendMessage: MessageFunctions["sendMessage"];
}

declare module "webext-bridge/background" {
  export const onMessage: MessageFunctions["onMessage"];
  export const sendMessage: MessageFunctions["sendMessage"];
}

declare module "webext-bridge/popup" {
  export const onMessage: MessageFunctions["onMessage"];
  export const sendMessage: MessageFunctions["sendMessage"];
}

declare module "webext-bridge/options" {
  export const onMessage: MessageFunctions["onMessage"];
  export const sendMessage: MessageFunctions["sendMessage"];
}

declare module "webext-bridge/window" {
  export const onMessage: MessageFunctions["onMessage"];
  export const sendMessage: MessageFunctions["sendMessage"];
}

declare module "webext-bridge/devtools" {
  export const onMessage: MessageFunctions["onMessage"];
  export const sendMessage: MessageFunctions["sendMessage"];
}
