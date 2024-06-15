import { Nullable } from '@/types/Utils';
import {
  MessageListener,
  SendMessage,
} from '@/types/WebpageMessenger';

class WSHook {
  private webSocketInstance: Nullable<WebSocket>;
  private longPollingInstance: Nullable<XMLHttpRequest>;

  private webSocketOriginalSend = WebSocket.prototype.send;

  public static contentScriptMessenger: {
    onMessage: MessageListener;
    sendMessage: SendMessage;
    // @ts-expect-error
  } = { ...window.Messenger };

  constructor() {
    this.webSocketInstance = null;
    this.longPollingInstance = null;

    this.proxyXMLHttpRequest();
    this.passivelyCaptureWebSocket();
  }

  getWebSocketInstance(): Nullable<WebSocket> {
    return this.webSocketInstance;
  }

  setWebSocketInstance(instance: WebSocket): void {
    if (!this.isValidWebSocketInstance(instance)) return;

    this.webSocketInstance = instance;
    this.proxyWebSocketInstance(instance);

    // @ts-expect-error
    window.capturedSocket = this.getActiveInstance();
  }

  isValidWebSocketInstance(instance: WebSocket): boolean {
    return instance?.readyState === 1;
  }

  getLongPollingInstance(): Nullable<XMLHttpRequest> {
    return this.longPollingInstance;
  }

  setLongPollingInstance(instance: XMLHttpRequest): void {
    const url = instance.responseURL;

    if (!url.includes('transport=polling')) return;

    this.longPollingInstance = instance;

    WSHook.contentScriptMessenger.sendMessage({
      event: 'longPollingCaptured',
    });

    // @ts-expect-error
    window.capturedSocket = this.getActiveInstance();
    // @ts-expect-error
    window.longPollingInstance = this.getLongPollingInstance();
  }

  getActiveInstance(): Nullable<WebSocket | XMLHttpRequest> {
    if (this.webSocketInstance && this.webSocketInstance.readyState === 1) {
      return this.getWebSocketInstance();
    }

    if (this.longPollingInstance) {
      return this.getLongPollingInstance();
    }

    return null;
  }

  getActiveInstanceType(): Nullable<'WebSocket' | 'Long-polling'> {
    if (this.getActiveInstance() instanceof WebSocket) {
      return 'WebSocket';
    }

    if (this.getActiveInstance() instanceof XMLHttpRequest) {
      return 'Long-polling';
    }

    return null;
  }

  async sendWebSocketMessage(
    data: any,
    forceLongPolling: boolean
  ): Promise<void | Response> {
    const instance = this.getActiveInstance();

    if (!instance) return alert('No active WebSocket connection found!');

    if (instance instanceof WebSocket) {
      if (forceLongPolling) {
        const url = instance.url
          .replace('wss://', 'https://')
          .replace('transport="websocket"', 'transport="polling"');

        const response = await fetch(url, {
          method: 'POST',
          body: data,
        });

        return response;
      }

      return instance.send(data);
    }

    if (instance instanceof XMLHttpRequest) {
      const url = instance.responseURL;

      if (!url) return;

      return fetch(url, {
        method: 'POST',
        body: data,
      });
    }
  }

  onWebSocketMessage({
    startCondition,
    stopCondition,
    callback,
  }: {
    startCondition: (message: MessageEvent['data']) => boolean;
    stopCondition: (message: MessageEvent['data']) => boolean;
    callback: (data: any) => void;
  }): Nullable<() => void> {
    const instance = this.getActiveInstance();

    if (!instance) return null;

    const stopListening = () => {
      if (instance instanceof WebSocket) {
        instance.removeEventListener(
          'message',
          webSocketMessageHandler as EventListenerOrEventListenerObject
        );
      } else if (instance instanceof XMLHttpRequest) {
        instance.removeEventListener(
          'readystatechange',
          longPollingMessageHandler
        );
      }
    };

    const webSocketMessageHandler = (event: MessageEvent) => {
      if (startCondition(event.data)) {
        callback(event.data);
      }

      if (stopCondition(event.data)) {
        stopListening();
      }
    };

    const longPollingMessageHandler = () => {
      if (!(instance instanceof XMLHttpRequest)) return;

      if (instance.readyState === 4) {
        callback(instance.responseText);
      }

      if (stopCondition(instance.responseText)) {
        stopListening();
      }
    };

    if (instance instanceof WebSocket) {
      instance.addEventListener(
        'message',
        webSocketMessageHandler as EventListenerOrEventListenerObject
      );
    } else if (instance instanceof XMLHttpRequest) {
      instance.addEventListener('readystatechange', longPollingMessageHandler);
    }

    return stopListening;
  }

  proxyWebSocketInstance(instance: WebSocket): void {
    // "onopen"
    const originalOpen = instance.onopen;
    instance.onopen = (event: Event) => {
      WSHook.contentScriptMessenger.sendMessage({
        event: 'webSocketEvent',
        payload: { event: 'open', payload: event },
      });
      if (originalOpen) originalOpen.call(instance, event);
    };

    // "onmessage"
    const originalMessage = instance.onmessage;
    instance.onmessage = (event: MessageEvent) => {
      WSHook.contentScriptMessenger.sendMessage({
        event: 'webSocketEvent',
        payload: { event: 'message', payload: event.data },
      });

      if (originalMessage) originalMessage.call(instance, event);
    };

    // "onclose"
    const originalClose = instance.onclose;
    instance.onclose = (event: CloseEvent) => {
      WSHook.contentScriptMessenger.sendMessage({
        event: 'webSocketEvent',
        payload: { event: 'close', payload: 'closed' },
      });
      if (originalClose) originalClose.call(instance, event);
      this.passivelyCaptureWebSocket();
    };

    // "send" method
    const originalSend = instance.send;
    instance.send = async (data: any) => {
      const modifiedData = await WSHook.contentScriptMessenger.sendMessage({
        event: 'webSocketEvent',
        payload: { event: 'send', payload: data },
        timeout: 1000,
      });

      if (typeof modifiedData !== 'string') return;

      originalSend.call(instance, modifiedData);
    };
  }

  async proxyXMLHttpRequest() {
    const self = this;

    const originalXMLHttpRequestOpen = XMLHttpRequest.prototype.open;
    const originalXMLHttpRequestSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string,
      async?: boolean,
      user?: string | null,
      password?: string | null
    ) {
      this.addEventListener(
        'readystatechange',
        function () {
          if (this.readyState === 4) {
            self.setLongPollingInstance(this);

            try {
              const messages = this.responseText.split('');

              if (!Array.isArray(messages)) return;

              for (const message of messages) {
                WSHook.contentScriptMessenger.sendMessage({
                  event: 'longPollingEvent',
                  payload: { event: 'response', payload: message },
                });
              }
            } catch (e) {
              // Do nothing
            }
          }
        },
        false
      );

      originalXMLHttpRequestOpen.call(
        this,
        method,
        url,
        async!,
        user,
        password
      );
    };

    XMLHttpRequest.prototype.send = async function (data?: string | null) {
      self.setLongPollingInstance(this);

      let newData: string = '';

      try {
        const messages = data?.split('');

        if (!Array.isArray(messages)) throw new Error('Invalid data format');

        for (const message of messages) {
          newData +=
            (await WSHook.contentScriptMessenger.sendMessage({
              event: 'longPollingEvent',
              payload: { event: 'request', payload: message },
              timeout: 1000,
            })) + '';
        }

        newData = newData.slice(0, -1);
      } catch (e) {
        newData = data || '';
      } finally {
        originalXMLHttpRequestSend.call(this, newData);
      }
    };
  }

  passivelyCaptureWebSocket(): void {
    const self = this;

    WebSocket.prototype.send = function (data: any): void {
      WSHook.contentScriptMessenger.sendMessage({
        event: 'webSocketEvent',
        payload: { event: 'send', payload: data },
      });

      WebSocket.prototype.send = self.webSocketOriginalSend;

      self.setWebSocketInstance(this);

      WSHook.contentScriptMessenger.sendMessage({
        event: 'webSocketCaptured',
      });

      // @ts-expect-error
      return self.webSocketOriginalSend.apply(this, arguments);
    };
  }
}

(() => {
  if (typeof chrome.storage !== 'undefined') return;

  const wsHook = new WSHook();

  WSHook.contentScriptMessenger.onMessage(
    'sendWebSocketMessage',
    async (data) => {
      wsHook.sendWebSocketMessage(data.payload, !!data.forceLongPolling);
    }
  );

  WSHook.contentScriptMessenger.onMessage(
    'getActiveWebSocketType',
    async () => {
      return wsHook.getActiveInstanceType();
    }
  );

  WSHook.contentScriptMessenger.onMessage('routeToPage', async (data) => {
    if (typeof data.payload === 'object') {
      // @ts-expect-error
      return window.next.router.push(data.payload.url, undefined, {
        scroll: data.payload.scroll,
      });
    }

    // @ts-expect-error
    window.next.router.push(data.payload, undefined, {
      scroll: data.payload !== window.location.pathname,
    });
  });
})();
