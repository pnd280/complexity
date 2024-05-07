class WSHook {
  #socket = undefined;
  #registeredInterceptingMessages = [];

  constructor() {}

  addInterceptingMessage(message) {
    this.#registeredInterceptingMessages.push(message);
  }

  getInterceptedMessages() {
    return this.#registeredInterceptingMessages;
  }

  setSocket(socket) {
    this.#socket = socket;
  }

  getSocket() {
    return this.#socket;
  }

  async sendMessage(message) {
    return this.getSocket().send(WSMessage.stringify(message));
  }

  registerMessageEvents() {
    if (!this.getSocket()) return;

    [
      {
        interceptedEvent: 'perplexity_ask',
        interceptedCallback: (payload) => {
          const [query, eventData, ...rest] = payload;

          if (eventData.isInternal) return payload;

          const searchFocus =
            unsafeWindow.PERSISTENT_SETTINGS.focus || eventData.search_focus;

          const currentModelCode =
            unsafeWindow.PERSISTENT_SETTINGS.chatModelCode ||
            eventData.model_preference;

          const querySource = eventData.query_source;

          const targetCollectionUuid =
            unsafeWindow.PERSISTENT_SETTINGS.collection?.uuid;

          switch (currentModelCode) {
            case 'claude3opus':
              unsafeWindow.PERSISTENT_SETTINGS.opusQueryLimit -= 1;
              break;
            case 'turbo':
              break;
            default:
              unsafeWindow.PERSISTENT_SETTINGS.queryLimit -= 1;
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
            },
            ...rest,
          ];
        },
      },
      {
        interceptedEvent: 'create_image_for_entry',
        interceptedCallback: (payload) => {
          unsafeWindow.PERSISTENT_SETTINGS.imageGenerationLimit -= 1;

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

    // Hook into WebSocket send
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

    // Hook into WebSocket messages
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
        default:
          return originalAddEventListener.apply(this, arguments);
      }
    };

    // Also hook into the onmessage property
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
  }
}
