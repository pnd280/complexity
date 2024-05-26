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

  static setReactTextareaValue(textarea, newValue) {
    if (!textarea) return;

    const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    ).set;
    nativeTextareaValueSetter.call(textarea, newValue);

    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  static whereAmI() {
    const location = window.location.href;

    switch (true) {
      case location.startsWith('https://www.perplexity.ai/collections'):
        return 'collection';
      case location.startsWith('https://www.perplexity.ai/search'):
        return 'thread';
      case location.startsWith('https://labs.perplexity.ai/'):
        return 'lab';
      case location.startsWith('https://www.perplexity.ai/page'):
        return 'page';
    }
  }

  static async sleep(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
  }

  static scrollToElement($anchor, offset = 0) {
    const $stickyHeader = UI.getStickyHeader();

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

  static increaseScrollSpeed(modifier) {
    let originalScrollHandler = null;

    function handleScroll(event) {
      if (event.altKey) {
        $(window).scrollTop(
          $(window).scrollTop() + event.originalEvent.deltaY * modifier
        );
      } else if (originalScrollHandler) {
        originalScrollHandler(event);
      }
    }

    $(window).on('wheel', function (event) {
      if (originalScrollHandler === null) {
        originalScrollHandler = event.currentTarget.onscroll;
      }
      handleScroll(event);
    });
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

  static markdown2Html(markdown) {
    const escapeHtmlTags = (html) => {
      return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    const unescapeHtmlTags = (html) => {
      return html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    };

    const converter = new showdown.Converter();
    converter.setOption('tables', true);
    converter.setOption('simpleLineBreaks', true);

    const html = converter.makeHtml(escapeHtmlTags(markdown));

    const $tag = $('<div>').html(html);

    $tag.find('*').each((_, e) => {
      const tagName = e.tagName.toLowerCase();

      if (tagName === 'code') {
        const code = $(e).text();
        $(e).html(escapeHtmlTags(unescapeHtmlTags(code)));
      }
    });

    return DOMPurify.sanitize($tag.html());
  }

  static calculateRenderLines(text, containerWidth, fontFamily, fontSize) {
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

  static findReactFiber($element) {
    const fiberKey = Object.keys($element[0]).find((key) =>
      key.startsWith('__reactFiber')
    );

    const fiber = $element[0][fiberKey];

    return fiber;
  }
}

class MyObserver {
  static bindIntervalToElement(element, callback, delay) {
    if (!document.contains(element)) return;

    const observer = new MutationObserver((mutations, observer) => {
      if (!document.contains(element)) {
        observer.disconnect();
        clearInterval(intervalId);
        return;
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const intervalId = setInterval(callback, delay);

    return intervalId;
  }

  static onElementExist({
    selector,
    callback,
    recurring = true,
    id = 'observed',
  }) {
    requestIdleCallback(() => {
      checkAndInvokeCallback();
    });

    const observer = new MutationObserver(() => {
      checkAndInvokeCallback();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    function checkAndInvokeCallback() {
      let elements;

      if (typeof selector === 'string') {
        elements = $(selector).toArray();
      } else if (typeof selector === 'function') {
        elements = selector();
      }

      elements?.forEach((element) => {
        if (!document.contains(element)) return;

        if ($(element).data(id) !== true) {
          callback({
            element,
            reobserve: () => $(element).data(id, false),
          });

          $(element).data(id, true);
          $(element).attr(`data-${id}`, true);
        }
      });

      if (!recurring) {
        observer.disconnect();
      }
    }
  }

  static onDOMChanges({ targetNode, callback, recurring = false }) {
    if (!targetNode || typeof callback !== 'function') return;

    const observerConfig = {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    };

    let observer;

    const startObserving = () => {
      observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          callback(mutation);
        }
        if (recurring && !document.body.contains(targetNode)) {
          observer.disconnect();
          const checkExistence = setInterval(() => {
            if (document.body.contains(targetNode)) {
              clearInterval(checkExistence);
              startObserving();
            }
          }, 1000);
        }
      });
      observer.observe(targetNode, observerConfig);
    };

    const checkNodeExistence = () => {
      if (document.body.contains(targetNode)) {
        startObserving();
      } else if (recurring) {
        const checkExistence = setInterval(() => {
          if (document.body.contains(targetNode)) {
            clearInterval(checkExistence);
            startObserving();
          }
        }, 1000);
      }
    };

    checkNodeExistence();
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

  static onElementBlur({ $element, eventName, callback }) {
    $(document)
      .off(`click.${eventName}`)
      .on(`click.${eventName}`, (e) => {
        if (!$element.is(e.target) && $element.has(e.target).length === 0) {
          callback();

          $(document).off(`click.${eventName}`);
        }
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
