class WSHook {
  #socket = undefined;
  #registeredInterceptingMessages = [];

  persistentSettings = {};

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
            this.persistentSettings.searchFocus || eventData.search_focus;

          const modelPreference =
            this.persistentSettings.chatModelCode || eventData.model_preference;

          const querySource = eventData.query_source;

          const targetCollectionUuid = this.persistentSettings.collection?.uuid;

          Logger.log(
            `Focus: ${searchFocus}`,
            `Model: ${modelPreference}`,
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
                  ? modelPreference
                  : eventData.model_preference,
              target_collection_uuid:
                querySource !== 'followup' ? targetCollectionUuid : undefined,
            },
            ...rest,
          ];
        },
      },
      {
        interceptedEvent: 'analytics_event',
        interceptedCallback: (data) => {
          const eventName = data[0].event_name;

          if (eventName !== 'search focus click') return data;

          const searchFocus = data[0].event_data.assistant;

          this.persistentSettings.searchFocus = searchFocus || undefined;

          Logger.log('Focus:', searchFocus);

          return data;
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

    this.getInterceptedMessages().forEach((message) => {
      const { interceptedEvent, interceptedCallback } = message;

      if (interceptedEvent !== event) return;

      Logger.log(`Intercepting: '${event}'`, ...data);

      interceptedData = interceptedCallback(data);

      Logger.log(`Intercepted: '${event}'`, ...interceptedData);
    });

    return WSMessage.stringify({
      ...parsedMessage,
      event,
      data: interceptedData,
    });
  }

  hookSocket() {
    const self = this;

    // Hook into WebSocket send
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
      if (!self.getSocket()) {
        Logger.log('Socket hooked');
        self.setSocket(this);
        self.registerMessageEvents();
      }

      Logger.log('ws send:', data);

      const interceptedData = self.#interceptMessage(data);

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
      if (type === 'message') {
        const hookedListener = function (event) {
          Logger.log('ws received:', event.data);
          return listener.apply(this, arguments);
        };
        return originalAddEventListener.call(this, type, hookedListener);
      } else {
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
              Logger.log('ws onmessage:', event.data);
              handler.apply(this, arguments);
            }
          );
        }
      },
    });
  }
}
