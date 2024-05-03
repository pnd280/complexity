class Utils {
  static setImmediateInterval(callback, interval, ...args) {
    callback();
    return setInterval(callback, interval, ...args);
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
    // Replace escaped characters in the correct order
    return escapedJson
      .replace(/\\\\/g, '\\') // Unescape backslashes
      .replace(/\\\"/g, '"') // Unescape double quotes
      .replace(/\\n/g, '\n') // Unescape newlines
      .replace(/\\r/g, '\r') // Unescape carriage returns
      .replace(/\\t/g, '\t') // Unescape tabs
      .replace(/\\b/g, '\b') // Unescape backspaces
      .replace(/\\f/g, '\f'); // Unescape form feeds
  }

  static escape(json) {
    // Replace special characters in the correct order
    return json
      .replace(/\\/g, '\\\\') // Escape backslashes
      .replace(/"/g, '\\"') // Escape double quotes
      .replace(/\n/g, '\\n') // Escape newlines
      .replace(/\r/g, '\\r') // Escape carriage returns
      .replace(/\t/g, '\\t') // Escape tabs
      .replace(/\\b/g, '\\b') // Escape backspaces
      .replace(/\f/g, '\\f'); // Escape form feeds
  }
}

class WSMessage {
  static parse(message) {
    if (typeof message !== 'string') {
      return null;
    }

    // First, we need to trim any leading or trailing whitespace from the message
    message = message.trim();

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
    if (!Array.isArray(data) || data.length < 2) {
      console.error('Parsed data is not in the expected format');
      return null;
    }

    // Extract the event name and the data
    const [event, ...eventData] = data;

    // Construct the output object
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

    // Convert the event and data back into the array format and then to a JSON string
    const eventData = JSON.stringify([event, ...data]);

    // Concatenate the message code with the JSON string
    const stringifiedMessage = `${messageCode}${eventData}`;

    return stringifiedMessage;
  }
}
