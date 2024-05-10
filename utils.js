class Utils {
  static loadScriptAsync(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

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

  static scrollToElement($anchor, offset = 0) {
    const $stickyHeader = UITweaks.getStickyHeader();

    if ($stickyHeader.length) {
      offset -= $stickyHeader.height();
    }

    const elementPosition = $anchor.offset().top;
    const scrollPosition = elementPosition + offset;

    $('html, body').animate(
      {
        scrollTop: scrollPosition,
      },
      500
    );
  }

  static findMostVisibleElementIndex(elements) {
    let maxVisiblePercentage = 0;
    let indexWithMaxVisible = -1;

    elements.forEach((element, index) => {
      const visiblePercentage = getVisiblePercentage(element);
      if (visiblePercentage > maxVisiblePercentage) {
        maxVisiblePercentage = visiblePercentage;
        indexWithMaxVisible = index;
      }
    });

    return indexWithMaxVisible;

    function getVisiblePercentage(element) {
      const rect = element.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const windowWidth =
        window.innerWidth || document.documentElement.clientWidth;

      // Calculate the visible part of the element
      const visibleWidth = Math.max(
        0,
        Math.min(rect.right, windowWidth) - Math.max(rect.left, 0)
      );
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
      );
      const visibleArea = visibleWidth * visibleHeight;
      const totalArea = rect.width * rect.height;

      return (visibleArea / totalArea) * 100;
    }
  }

  static onShallowRouteChange(callback) {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;

        callback();
      }
    }).observe(document, { subtree: true, childList: true });
  }

  static convertMarkdownToHTML(markdownText) {
    const converter = new showdown.Converter();
    const dirtyHtml = converter.makeHtml(escapeHTMLTagsSmart(markdownText));
    const cleanHtml = DOMPurify.sanitize(dirtyHtml);
    return cleanHtml;

    function escapeHTMLTagsSmart(markdown) {
      let result = '';
      let inCode = false;
      let currentChar = '';

      // TODO: investigate performance
      for (let i = 0; i < markdown.length; i++) {
        currentChar = markdown[i];

        // Check if entering or exiting code block
        if (currentChar === '`') {
          // Toggle the inCode state
          inCode = !inCode;
          result += currentChar;
          continue;
        }

        if (!inCode) {
          // Escape < and > if not in code
          if (currentChar === '<') {
            result += '&lt;';
          } else if (currentChar === '>') {
            result += '&gt;';
          } else {
            result += currentChar;
          }
        } else {
          // Add character as is if in code
          result += currentChar;
        }
      }

      return result;
    }
  }

  static calculateLines(text, containerWidth, fontFamily, fontSize) {
    // Create a temporary canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set the font properties
    context.font = `${fontSize}px ${fontFamily}`;

    // Split the text into words
    const words = text.split(' ');
    let line = '';
    let lines = 1;

    // Iterate over each word
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = context.measureText(testLine);

      // If the test line is wider than the container, start a new line
      if (metrics.width > containerWidth) {
        lines++;
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }

    return lines;
  }
}

class MyObserver {
  static closePopovers() {
    $(window).scroll(() => {
      $('[id$="-popover"]').each((_, popover) => {
        $(popover).remove();
      });
    });
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

  static safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      return null;
    }
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

    data = JSONUtils.safeParse(jsonString);

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
