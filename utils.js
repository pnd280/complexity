class Utils {
  static setImmediateInterval(callback, interval, ...args) {
    callback();
    return setInterval(callback, interval, ...args);
  }

  static bindIntervalToElement(element, callback, delay) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.removedNodes.length > 0) {
          const removedElements = Array.from(mutation.removedNodes);
          if (removedElements.includes(element)) {
            clearInterval(intervalId);
            observer.disconnect();
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const intervalId = setInterval(callback, delay);

    return intervalId;
  }

  static whereAmI() {
    const location = window.location.href;

    switch (true) {
      case location.startsWith('https://www.perplexity.ai/collections'):
        return 'collection';
      case location.startsWith('https://www.perplexity.ai/search'):
        return 'thread';
    }
  }

  static async sleep(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
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
      return message;
    }

    // if not starting with a number, return the message as is
    if (isNaN(parseInt(message[0], 10))) {
      return message;
    }

    // First, we need to trim any leading or trailing whitespace from the message
    message = message.trim();

    // Handle long-polling socket messages
    const unexpectedSeparator = '';

    const weirdCharIndex = message.indexOf(unexpectedSeparator);
    if (weirdCharIndex !== -1) {
      message = message.substring(0, weirdCharIndex);
    }

    // Extract the message code by finding the first occurrence of '['
    const startIndex = message.indexOf('[');

    if (startIndex === -1) {
      return message;
    }

    const messageCode = parseInt(message.substring(0, startIndex), 10);

    // Extract the JSON part of the message
    const jsonString = message.substring(startIndex);
    let data = [];

    try {
      // Parse the JSON string to an array
      data = JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON from message:', error);
      return null;
    }

    // Check if data is in the expected format
    if (!Array.isArray(data)) {
      console.error('Parsed data is not in the expected format');
      return null;
    }

    let output;

    if (data.length < 2) {
      output = {
        messageCode,
        event: 'blank',
        data,
      };
    } else {
      // Extract the event name and the data
      const [event, ...eventData] = data;

      // Construct the output object
      output = {
        messageCode,
        event,
        data: eventData,
      };
    }

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
