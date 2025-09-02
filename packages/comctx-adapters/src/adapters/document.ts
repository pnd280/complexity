import type { Adapter, OnMessage, SendMessage } from "comctx";

export class ChromiumDocumentAdapter implements Adapter {
  private readonly namespace: string;

  constructor(namespace?: string) {
    this.namespace = namespace ?? "comctx-document-adapter-message";
  }

  sendMessage: SendMessage = (message) => {
    window.postMessage(
      { type: this.namespace, data: message },
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

export class FirefoxDocumentAdapter implements Adapter {
  private readonly namespace: string;

  constructor(namespace?: string) {
    this.namespace = namespace ?? "comctx-document-adapter-message";
  }

  sendMessage: SendMessage = (message) => {
    window.postMessage(
      { type: this.namespace, data: JSON.stringify(message) },
      window.location.origin,
    );
  };

  onMessage: OnMessage = (callback) => {
    const handler = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === this.namespace
      ) {
        callback(JSON.parse(event.data.data));
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  };
}
