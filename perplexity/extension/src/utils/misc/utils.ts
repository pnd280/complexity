import { MatchPattern } from "@webext-core/match-patterns";

import type { MaybePromise } from "@/types/utils.types";
import { errorWrapper } from "@/utils/wrappers/error-wrapper";

export const jsonUtils = {
  safeParse(json: string) {
    try {
      return JSON.parse(json);
    } catch (_error) {
      return null;
    }
  },
  unescape(jsonString: string): string {
    return jsonString
      .replace(/\\"/g, '"') // Double quote
      .replace(/\\\\/g, "\\"); // Backslash
  },
};

export function escapeHtmlTags(html: string) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function stripHtml(html: string | undefined) {
  if (!html) {
    return "";
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchTextResource(url: string) {
  const response = await fetch(url);

  invariant(response.ok, `Failed to fetch resource: ${url}`);

  return response.text();
}

type ParsedUrl = {
  hostname: string;
  pathname: string;
  search: string;
  hash: string;
  queryParams: URLSearchParams;
};

export function parseUrl(url: string = window.location.href): ParsedUrl {
  const parsedUrl: ParsedUrl = {
    hostname: "",
    pathname: "",
    search: "",
    hash: "",
    queryParams: new URLSearchParams(),
  };

  try {
    const normalizedUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
    const urlObject = new URL(normalizedUrl);

    parsedUrl.hostname = urlObject.hostname;
    parsedUrl.pathname = urlObject.pathname;
    parsedUrl.search = urlObject.search;
    parsedUrl.hash = urlObject.hash.slice(1);

    parsedUrl.queryParams = new URLSearchParams(urlObject.search);
  } catch (_error) {
    console.error("Invalid URL:", url);
  }

  return parsedUrl;
}

export const whereAmI = (() => {
  const hostname =
    typeof window === "undefined"
      ? "www.perplexity.ai"
      : window.location.hostname;

  const pplxHostnamePattern = /(www\.)?perplexity\.ai/;
  const hostnameGlob = `https://*.perplexity.ai`;

  const patternMap = {
    home: [new MatchPattern(`${hostnameGlob}/`)],
    comet_assistant: [new MatchPattern(`${hostnameGlob}/sidecar*`)],
    comet_ntp: [new MatchPattern(`${hostnameGlob}/b/home*`)],
    discover: [new MatchPattern(`${hostnameGlob}/discover*`)],
    collections_page: [
      new MatchPattern(`${hostnameGlob}/spaces`),
      new MatchPattern(`${hostnameGlob}/spaces/`),
      new MatchPattern(`${hostnameGlob}/collections`),
      new MatchPattern(`${hostnameGlob}/spaces/`),
    ],
    collection: [
      new MatchPattern(`${hostnameGlob}/spaces/*`),
      new MatchPattern(`${hostnameGlob}/spaces/*`),
    ],
    library: [new MatchPattern(`${hostnameGlob}/library*`)],
    thread: [new MatchPattern(`${hostnameGlob}/search/*`)],
    page: [new MatchPattern(`${hostnameGlob}/page/*`)],
    settings: [
      new MatchPattern(`${hostnameGlob}/account*`),
      new MatchPattern(`${hostnameGlob}/settings*`),
    ],
    same_origin: [new MatchPattern(`${hostnameGlob}/*`)],
  };

  type Location = keyof typeof patternMap;

  return function (providedUrl?: string): Location | "unknown" {
    if (!providedUrl && typeof window === "undefined") {
      return "unknown";
    }

    if (!pplxHostnamePattern.test(hostname)) {
      return "unknown";
    }

    const baseUrl = `https://${hostname}`;

    for (const [key, patterns] of Object.entries(patternMap)) {
      if (
        patterns.some((pattern) =>
          pattern.includes(
            new URL(providedUrl || window.location.href, baseUrl).toString(),
          ),
        )
      ) {
        return key as Location;
      }
    }

    return "unknown";
  };
})();

export function isDomNode(element: unknown): element is HTMLElement | Element {
  return element instanceof HTMLElement || element instanceof Element;
}

export function isMainWorldContext() {
  return (
    typeof chrome === "undefined" ||
    typeof chrome.storage === "undefined" ||
    typeof chrome.storage.local === "undefined"
  );
}

export function isExtensionContext() {
  return !isMainWorldContext();
}

export function isInContentScript() {
  return whereAmI() !== "unknown";
}

export function isBackgroundScript(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).isBackgroundScript;
}

export function queueMicrotasks(...tasks: (() => void)[]) {
  tasks.forEach((task) => queueMicrotask(task));
}

export function requestIdleCallbacks(...tasks: (() => void)[]) {
  tasks.forEach((task) =>
    requestIdleCallback(task, {
      timeout: 1000,
    }),
  );
}

export function invariant(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: any,
  message?: string,
): asserts condition {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Converts an emoji code to its corresponding emoji character.
 *
 * @param {string} emojiCode - The emoji code to convert. Intended format: `2049-fe0f`.
 * @returns {string} The corresponding emoji character.
 */
export function emojiCodeToString(emojiCode: string): string {
  try {
    const parts = emojiCode.split("-");

    const codePoints = parts.map((part) => {
      const codePoint = parseInt(part, 16);
      if (isNaN(codePoint)) {
        throw new Error(`Invalid emoji code part: ${part}`);
      }
      return codePoint;
    });

    return String.fromCodePoint(...codePoints);
  } catch (_error) {
    return "";
  }
}

export function getOptionsPageUrl({ isDev }: { isDev: boolean }) {
  const prefix = isDev ? "src/entrypoints/options-page/" : "";

  return chrome.runtime.getURL(`${prefix}options.html`);
}

export function getTaskScheduler() {
  return document.visibilityState === "visible"
    ? requestAnimationFrame
    : queueMicrotask;
}

export function keysToString(keys: string[]) {
  return keys.map((key) => key.toLowerCase()).join("+");
}

export function waitUntil(params: {
  condition: () => MaybePromise<boolean>;
  timeout?: number;
  interval?: number;
}): Promise<void> {
  const { condition, timeout = 5000, interval = 500 } = params;

  return new Promise((resolve) => {
    let isRunning = false;

    const checkCondition = async () => {
      if (isRunning) return;

      isRunning = true;
      const [result, error] = await errorWrapper(condition)();
      isRunning = false;

      if (!error && result === true) {
        clearInterval(intervalId);
        resolve();
      }
    };

    const intervalId = setInterval(checkCondition, interval);

    void checkCondition();

    setTimeout(() => {
      clearInterval(intervalId);
      resolve();
    }, timeout);
  });
}

/**
 * Checks if arr1 is a subsequence of arr2 (all elements of arr1 appear in arr2 in the same order, but not necessarily consecutive).
 * @param arr1 - The array to check if it's a subsequence
 * @param arr2 - The array to check against
 * @returns True if arr1 is a subsequence of arr2, false otherwise
 */
export function isSubArray(arr1: unknown[], arr2: unknown[]) {
  if (arr1.length > arr2.length) return false;

  let j = 0;
  for (let i = 0; i < arr2.length && j < arr1.length; i++) {
    if (arr1[j] === arr2[i]) {
      j++;
    }
  }

  return j === arr1.length;
}
