import DOMPurify from 'dompurify';
import $ from 'jquery';
import showdown from 'showdown';

import { ui } from './ui';

export const logger = {
  enable: true,

  log(...args: any[]) {
    if (this.enable) console.log(...args);
  },

  on() {
    this.enable = true;
  },

  off() {
    this.enable = false;
  },
};

export const jsonUtils = {
  unescape(escapedJson: string) {
    return (
      escapedJson
        .replace(/\\\\/g, '\\') // backslashes
        // eslint-disable-next-line no-useless-escape
        .replace(/\\\"/g, '"') // double quotes
        .replace(/\\n/g, '\n') // newlines
        .replace(/\\r/g, '\r') // carriage returns
        .replace(/\\t/g, '\t') // tabs
        .replace(/\\b/g, '\b') // backspaces
        .replace(/\\f/g, '\f')
    ); // form feeds
  },
  escape(json: string) {
    return json
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\\b/g, '\\b')
      .replace(/\f/g, '\\f');
  },
  safeParse(json: string) {
    try {
      return JSON.parse(json);
    } catch (error) {
      return null;
    }
  },
};

export function compareVersions(v1: string, v2: string) {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const part1 = v1Parts[i] || 0;
    const part2 = v2Parts[i] || 0;

    if (part1 !== part2) {
      return part1 > part2 ? 1 : -1;
    }
  }

  return 0;
}

export function markdown2Html(markdown: string) {
  const escapeHtmlTags = (html: string) => {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  const unescapeHtmlTags = (html: string) => {
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

export function calculateRenderLines(
  text: string,
  containerWidth: number,
  fontFamily: string,
  fontSize: number
): number {
  // Create a temporary canvas element
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

  if (!context) {
    throw new Error('Failed to get 2D context');
  }

  // Set the font properties
  context.font = `${fontSize}px ${fontFamily}`;

  // Split the text into words
  const words: string[] = text.split(' ');
  let line: string = '';
  let lines: number = 1;

  // Iterate over each word
  for (let i = 0; i < words.length; i++) {
    const testLine: string = line + words[i] + ' ';
    const metrics: TextMetrics = context.measureText(testLine);

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

export function detectConsecutiveClicks(params: {
  element: Element;
  requiredClicks: number;
  clickInterval: number;
  callback: () => void;
}): void {
  let clickCount = 0;
  let clickTimer: number | undefined;

  $(params.element)
    .off('click')
    .on('click', () => {
      clickCount++;

      if (clickCount === 1) {
        clickTimer = window.setTimeout(() => {
          clickCount = 0;
        }, params.clickInterval);
      }

      if (clickCount === params.requiredClicks) {
        if (clickTimer !== undefined) {
          clearTimeout(clickTimer);
        }
        clickCount = 0;
        params.callback();
      }
    });
}

export function scrollToElement($anchor: JQuery<Element>, offset = 0) {
  const $stickyHeader = ui.getStickyHeader();

  if ($stickyHeader.length) {
    offset -= $stickyHeader.height() || 0;
  }

  const elementPosition = $anchor.offset()?.top;
  const scrollPosition = (elementPosition || 0) + offset;

  $('html, body').animate(
    {
      scrollTop: scrollPosition,
    },
    500
  );
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchResource(url: string) {
  const response = await fetch(url);
  return response.text();
}

export async function getTabId() {
  const response = await chrome.runtime.sendMessage({ action: 'getTabId' });
  return response.tabId;
}

export function setImmediateInterval(
  callback: (...args: any[]) => void,
  interval: number,
  ...args: any[]
): number {
  callback();
  return window.setInterval(callback, interval, ...args);
}

export function setCookie(name: string, value: any, days: number) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

export function whereAmI() {
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
    default:
      return 'unknown';
  }
}

export async function getPPLXBuildId() {
  const NEXTDATA = await getNEXTDATA();

  return NEXTDATA.buildId;
}

export async function getNEXTDATA() {
  while (!$('script#__NEXT_DATA__').text().includes('"buildId":')) {
    await sleep(100);
  }

  return jsonUtils.safeParse($('script#__NEXT_DATA__').text());
}
