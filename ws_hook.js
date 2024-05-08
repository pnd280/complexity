class WSHook {
  #socket = undefined;
  #longPollingSocket = undefined;
  #registeredInterceptingMessages = [];

  constructor() {}

  addInterceptingMessage(message) {
    this.#registeredInterceptingMessages.push(message);
  }

  getInterceptedMessages() {
    return this.#registeredInterceptingMessages;
  }

  getActiveSocketType() {
    if (this.getSocket() && this.getSocket()?.readyState === 1) return 'socket';
    if (this.getLongPollingSocket()) return 'long-polling';

    return null;
  }

  getActiveSocket() {
    if (this.getSocket() && this.getSocket()?.readyState === 1) {
      return this.getSocket();
    }

    if (this.getLongPollingSocket()) {
      return this.getLongPollingSocket();
    }

    return null;
  }

  setSocket(socket) {
    this.#socket = socket;
  }

  getSocket() {
    return this.#socket;
  }

  setLongPollingSocket(socket) {
    this.#longPollingSocket = socket;
  }

  getLongPollingSocket() {
    return this.#longPollingSocket;
  }

  async sendMessage(message) {
    const socketType = this.getActiveSocketType();

    if (socketType === 'socket') {
      return this.getActiveSocket().send(WSMessage.stringify(message));
    }

    const url = this.getLongPollingSocket().responseURL;

    return fetch(url, {
      method: 'POST',
      body: WSMessage.stringify(message),
    });
  }

  registerMessageEvents() {
    if (!this.getActiveSocket()) return;

    [
      {
        interceptedEvent: 'perplexity_ask',
        interceptedCallback: (payload) => {
          const [query, eventData, ...rest] = payload;

          if (eventData.isInternal) return payload;

          const searchFocus =
            unsafeWindow.STORE.focus || eventData.search_focus;

          const currentModelCode =
            unsafeWindow.STORE.chatModelCode ||
            eventData.model_preference;

          const querySource = eventData.query_source;

          const targetCollectionUuid =
            unsafeWindow.STORE.activeCollectionUUID;

          switch (currentModelCode) {
            case 'claude3opus':
              unsafeWindow.STORE.opusQueryLimit -= 1;
              break;
            case 'turbo':
              break;
            default:
              unsafeWindow.STORE.queryLimit -= 1;
              break;
          }

          ModelSelector.updateChatModelFn();

          Logger.log(
            `Focus: ${searchFocus}`,
            `Model: ${currentModelCode}`,
            `Collection: ${targetCollectionUuid}`
          );

          return [
            // query + JSONUtils.unescape('\\n\\nsite:nextjs.org'),
            query,
            {
              ...eventData,
              search_focus: searchFocus,
              model_preference:
                querySource !== 'retry'
                  ? currentModelCode
                  : eventData.model_preference,
              target_collection_uuid:
                querySource !== 'followup' ? targetCollectionUuid : undefined,
              // is_incognito: true,
            },
            ...rest,
          ];
        },
      },
      {
        interceptedEvent: 'create_image_for_entry',
        interceptedCallback: (payload) => {
          unsafeWindow.STORE.imageGenerationLimit -= 1;

          ModelSelector.updateImageModelFn();

          return payload;
        },
      },
      {
        interceptedEvent: 'analytics_event',
        interceptedCallback: (data) => {
          Logger.log('Blocked telemetry:', data[0].event_name);

          return null; // block telemetry
        },
      },
    ].forEach((event) => this.addInterceptingMessage(event));

    Logger.log('Socket intercepting messages registered');
  }

  #interceptMessage(originalMessage) {
    const parsedMessage = WSMessage.parse(originalMessage);

    if (typeof parsedMessage !== 'object') return parsedMessage;

    if (!parsedMessage) return;

    const { event, data } = parsedMessage;

    let interceptedData = [...data];

    for (const message of this.getInterceptedMessages()) {
      const { interceptedEvent, interceptedCallback } = message;

      if (interceptedEvent !== event) continue;

      Logger.log(`Intercepting: '${event}'`, ...data);

      interceptedData = interceptedCallback(data);

      if (!Array.isArray(interceptedData)) return originalMessage;

      Logger.log(`Intercepted: '${event}'`, ...interceptedData);

      break;
    }

    return WSMessage.stringify({
      ...parsedMessage,
      event,
      data: interceptedData,
    });
  }

  hookSocket() {
    const self = this;

    const captureSocket = (socket) => {
      if (this.getSocket() && this.getSocket().readyState === 1) return;
      console.log('Socket hooked');
      this.setSocket(socket);
      this.registerMessageEvents();
    };

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
      captureSocket(this);

      Logger.log('ws send:', data);

      const interceptedData = self.#interceptMessage(data);

      if (!interceptedData) return;

      if (Array.isArray(interceptedData)) {
        interceptedData.forEach((element, index) => {
          arguments[index] = element;
        });
      } else {
        arguments[0] = interceptedData;
      }

      return originalSend.apply(this, arguments);
    };

    const originalAddEventListener = WebSocket.prototype.addEventListener;
    WebSocket.prototype.addEventListener = function (type, listener) {
      switch (type) {
        case 'message':
          const hookedListener = function (event) {
            captureSocket(this);

            Logger.log('ws received:', event.data);
            return listener.apply(this, arguments);
          };
          return originalAddEventListener.call(this, type, hookedListener);
        case 'error':
          Logger.log('ws error:', listener);

          return originalAddEventListener.apply(this, arguments);
        default:
          return originalAddEventListener.apply(this, arguments);
      }
    };

    Object.defineProperty(WebSocket.prototype, 'onmessage', {
      set: function (handler) {
        if (typeof handler === 'function') {
          return originalAddEventListener.call(
            this,
            'message',
            function (event) {
              captureSocket(this);

              Logger.log('ws onmessage:', event.data);
              handler.apply(this, arguments);
            }
          );
        }
      },
    });

    Object.defineProperty(WebSocket.prototype, 'onerror', {
      set: function (handler) {
        if (typeof handler === 'function') {
          return originalAddEventListener.call(this, 'error', function (event) {
            console.log('ws onerror:', event);
            handler.apply(this, arguments);

            UI.toast({
              message: `⚠️ Websocket connection failed. Fallback to long-polling XHR, bugs may occur.
                Get rid of this alert by refreshing the page, if still persist, restart the browser.`,
              duration: 10000,
            });
          });
        }
      },
    });

    Object.defineProperty(WebSocket.prototype, 'onopen', {
      set: function (handler) {
        if (typeof handler === 'function') {
          return originalAddEventListener.call(this, 'open', function (event) {
            captureSocket(this);
            handler.apply(this, arguments);
          });
        }
      },
    });

    const captureLongPollingSocket = (socket) => {
      if (
        !socket.responseURL ||
        !socket.responseURL.includes('transport=polling')
      )
        return;

      this.setLongPollingSocket(socket);
      this.registerMessageEvents();
    };

    const originalXMLHttpRequestOpen = XMLHttpRequest.prototype.open;
    const originalXMLHttpRequestSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      method,
      url,
      async,
      user,
      password
    ) {
      this.addEventListener(
        'readystatechange',
        function () {
          if (this.readyState === 4) {
            captureLongPollingSocket(this);

            Logger.log('Polling response:', this.responseText);
          }
        },
        false
      );

      originalXMLHttpRequestOpen.call(this, method, url, async, user, password);
    };

    XMLHttpRequest.prototype.send = function (data) {
      captureLongPollingSocket(this);

      let newData = data;

      try {
        const interceptedData = self.#interceptMessage(data);

        if (!interceptedData) return;

        newData = interceptedData;
      } catch (error) {
        // do nothing
      } finally {
        Logger.log('Polling request:', newData);
        originalXMLHttpRequestSend.call(this, newData);
      }
    };
  }
}
