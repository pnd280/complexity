import $ from 'jquery';

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
    return escapedJson
      .replace(/\\\\/g, '\\') // backslashes
      .replace(/\\\"/g, '"') // double quotes
      .replace(/\\n/g, '\n') // newlines
      .replace(/\\r/g, '\r') // carriage returns
      .replace(/\\t/g, '\t') // tabs
      .replace(/\\b/g, '\b') // backspaces
      .replace(/\\f/g, '\f'); // form feeds
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

export function detectConsecutiveClicks(params: {
  element: Element;
  requiredClicks: number;
  clickInterval: number;
  callback: () => void;
}): void {
  let clickCount = 0;
  let clickTimer: number | undefined;

  $(params.element).off('click').on('click', () => {
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
    let date = new Date();
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

export const ui = {
  findActiveQueryBoxTextarea() {
    return $('button[aria-label="Submit"]:last')
      .parents()
      .find('textarea[placeholder]:last');
  },
};

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
