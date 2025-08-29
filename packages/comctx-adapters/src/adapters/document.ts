import type { Adapter, Message, OnMessage, SendMessage } from "comctx";

export class DocumentAdapter implements Adapter {
  sendMessage: SendMessage = (message) => {
    /**
     * Compatible with Firefox
     * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Sharing_objects_with_page_scripts#cloneinto
     */
    const detail =
      typeof (globalThis as any).cloneInto === "function"
        ? (globalThis as any).cloneInto(message, document.defaultView)
        : message;
    document.dispatchEvent(new CustomEvent("message", { detail }));
  };
  onMessage: OnMessage = (callback) => {
    const handler = (event: Event) => {
      callback((event as CustomEvent<Message>).detail);
    };
    document.addEventListener("message", handler);
    return () => document.removeEventListener("message", handler);
  };
}

export const CustomEventInjectAdapter = DocumentAdapter;
