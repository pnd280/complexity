class Utils {
  static setImmediateInterval(callback, interval, ...args) {
    callback();
    return setInterval(callback, interval, ...args);
  }

  static whereAmI() {
    const location = window.location.href;

    switch (true) {
      case location.startsWith("https://www.perplexity.ai/collections"):
        return "collection";
      case location.startsWith("https://www.perplexity.ai/search"):
        return "thread";
    }
  }
}

class Logger {
  static #enable = false;

  static log(...args) {
    if (this.#enable) console.log(...args);
  }

  static enable() {
    this.#enable = true;
  }

  static disable() {
    this.#enable = false;
  }
}

class JSONUtils {
  static unescape(escapedJson) {
    return escapedJson
      .replace(/\\\\/g, '\\') // backslashes
      .replace(/\\\"/g, '"') // double quotes
      .replace(/\\n/g, '\n') // newlines
      .replace(/\\r/g, '\r') // carriage returns
      .replace(/\\t/g, '\t') // tabs
      .replace(/\\b/g, '\b') // backspaces
      .replace(/\\f/g, '\f'); // form feeds
  }

  static escape(json) {
    return json
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\\b/g, '\\b')
      .replace(/\f/g, '\\f');
  }
}

class WSMessage {
  static parse(message) {
    if (typeof message !== 'string') {
      return null;
    }

    message = message.trim();

    const startIndex = message.indexOf('[');

    if (startIndex === -1) {
      return message;
    }

    const messageCode = parseInt(message.substring(0, startIndex), 10);

    const jsonString = message.substring(startIndex);
    let data = [];

    try {
      data = JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON from message:', error);
      return null;
    }

    if (!Array.isArray(data) || data.length < 2) {
      console.error('Parsed data is not in the expected format');
      return null;
    }

    const [event, ...eventData] = data;

    const output = {
      messageCode,
      event,
      data: eventData,
    };

    return output;
  }

  static stringify(parsedMessage) {
    if (!parsedMessage || typeof parsedMessage !== 'object') {
      return parsedMessage;
    }

    let { messageCode, event, data } = parsedMessage;

    if (!Array.isArray(data)) {
      data = [data];
    }

    const eventData = JSON.stringify([event, ...data]);

    const stringifiedMessage = `${messageCode}${eventData}`;

    return stringifiedMessage;
  }
}
