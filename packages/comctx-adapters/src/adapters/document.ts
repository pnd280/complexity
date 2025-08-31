import type { Adapter, OnMessage, SendMessage } from "comctx";

export class DocumentAdapter implements Adapter {
  private readonly namespace: string;

  constructor(namespace?: string) {
    this.namespace = namespace ?? "comctx-document-adapter-message";
  }

  sendMessage: SendMessage = (message) => {
    /**
     * Compatible with Firefox
     * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Sharing_objects_with_page_scripts#cloneinto
     */
    const detail =
      typeof (globalThis as any).cloneInto === "function"
        ? (globalThis as any).cloneInto(message, document.defaultView)
        : message;

    window.postMessage(
      { type: this.namespace, data: detail },
      window.location.origin,
    );
  };

  onMessage: OnMessage = (callback) => {
    const handler = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === this.namespace
      ) {
        callback(event.data.data);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  };
}

export const CustomEventInjectAdapter = DocumentAdapter;
