import { MatchPattern } from "@webext-core/match-patterns";

import type { MaybePromise } from "@/types/utils.types";
import { errorWrapper } from "@/utils/error-wrapper";

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

export function detectConsecutiveClicks(params: {
  element: Element;
  requiredClicks: number;
  clickInterval: number;
  callback: () => void;
}): void {
  let clickCount = 0;
  let clickTimer: number | undefined;

  $(params.element)
    .off("click")
    .on("click", () => {
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

export function scrollToElement(
  $anchor: JQuery<Element>,
  offset = 0,
  duration = 300,
) {
  if (!$anchor[0]) return;

  const $scrollContainer = $anchor.closest(".overflow-auto, .overflow-y-auto");

  if ($scrollContainer[0]) {
    const containerRect = $scrollContainer[0].getBoundingClientRect();
    const elementRect = $anchor[0].getBoundingClientRect();

    const relativePosition = elementRect.top - containerRect.top;
    const scrollTarget =
      ($scrollContainer.scrollTop() ?? 0) + relativePosition + offset;

    $scrollContainer.animate(
      {
        scrollTop: scrollTarget,
      },
      {
        duration,
        easing: "swing",
      },
    );
  } else {
    $anchor[0].scrollIntoView({ behavior: "smooth" });
  }
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchTextResource(url: string) {
  const response = await fetch(url);

  invariant(response.ok, `Failed to fetch resource: ${url}`);

  return response.text();
}

export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(nameEQ)) {
      return decodeURIComponent(trimmedCookie.substring(nameEQ.length));
    }
  }

  return null;
}

export function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
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

export function waitForElement({
  selector,
  timeout = 5000,
  interval = 100,
}: {
  selector: string | (() => HTMLElement | Element);
  timeout?: number;
  interval?: number;
}): Promise<HTMLElement | Element | null> {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const element =
        typeof selector === "string" ? $(selector)[0] : selector();

      if (element != null) {
        clearInterval(intervalId);
        resolve(element);
      }
    }, interval);

    setTimeout(() => {
      clearInterval(intervalId);
      resolve(null);
    }, timeout);
  });
}

export function isDomNode(element: any): element is HTMLElement | Element {
  return element instanceof HTMLElement || element instanceof Element;
}

export const isMainWorldContext = () => {
  return (
    typeof chrome === "undefined" ||
    typeof chrome.storage === "undefined" ||
    typeof chrome.storage.local === "undefined"
  );
};

export const isExtensionContext = () => {
  return !isMainWorldContext();
};

export const isInContentScript = () => {
  return whereAmI() !== "unknown";
};

export function isBackgroundScript(): boolean {
  return (globalThis as any).isBackgroundScript;
}

export async function injectMainWorldScript({
  url,
  head = true,
  inject = true,
  waitForDocument = true,
}: {
  url: string;
  head?: boolean;
  inject?: boolean;
  waitForDocument?: boolean;
}) {
  if (!inject) return;

  if (waitForDocument) {
    await waitForDocumentReady();
  }

  return new Promise((resolve, reject) => {
    $("<script>")
      .attr({
        type: "module",
        src: url,
        onload: () => resolve(null),
        onerror: () => reject(new Error(`Failed to load script: ${url}`)),
      })
      .appendTo(head ? document.head : document.body);
  });
}

export function injectMainWorldScriptBlock({
  scriptContent,
  waitForExecution = false,
}: {
  scriptContent: string;
  waitForExecution?: boolean;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";

    const executionId = `__script_execution_${Date.now()}`;
    let executionCompleted = false;

    const markExecutionComplete = () => {
      executionCompleted = true;
      delete (window as unknown as Record<string, () => void>)[executionId];
      if (waitForExecution) {
        resolve();
      }
    };

    (window as unknown as Record<string, () => void>)[executionId] =
      markExecutionComplete;

    script.textContent = `
      ${scriptContent}
      (window['${executionId}'])?.();
    `;

    script.onload = () => {
      if (!waitForExecution || executionCompleted) {
        resolve();
      }
    };

    script.onerror = (event) =>
      reject(
        new Error(`Failed to load script: ${(event as ErrorEvent).message}`),
      );

    document.body.appendChild(script);
  });
}

export async function waitForDocumentReady() {
  return new Promise((resolve) => {
    return $(resolve);
  });
}

export function insertCss({
  css,
  id,
}: {
  css: string;
  id: string;
}): () => void {
  invariant(
    typeof css === "string",
    "css must be a string, instead got: " + css,
  );

  if (!id.startsWith("cplx-")) id = `cplx-${id}`;

  const isLink = css.startsWith("chrome-extension://");
  const tagName = isLink ? "link" : "style";
  const selector = `${tagName}#${id}`;
  const removeStyle = () => $(selector).remove();

  if ($(selector).length) {
    return removeStyle;
  }

  if (isLink) {
    $("<link>")
      .attr({
        rel: "stylesheet",
        href: css,
        id,
      })
      .appendTo("head");
  } else {
    $("<style>").text(css).attr("id", id).appendTo("head");
  }

  return removeStyle;
}

export function getReactPropsKey(element: Element) {
  return (
    Object.keys(element).find((key) => key.startsWith("__reactProps$")) || ""
  );
}

export function getReactFiberKey(element: Element) {
  return (
    Object.keys(element).find((key) => key.startsWith("__reactFiber$")) || ""
  );
}

export function onScrollDirectionChange({
  up,
  down,
  identifier,
}: {
  up?: () => void;
  down?: () => void;
  identifier: string;
}) {
  let lastScrollTop = 0;

  $(window).on(`scroll.${identifier}`, function () {
    const currentScrollTop = $(this).scrollTop();

    if (typeof currentScrollTop === "undefined") return;

    if (currentScrollTop > lastScrollTop) {
      down?.();
    } else {
      up?.();
    }

    lastScrollTop = currentScrollTop;
  });

  return () => $(window).off(`scroll.${identifier}`);
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

export function invariant(condition: any, message?: string): asserts condition {
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

export function untrapWheel(e: React.WheelEvent<HTMLDivElement>) {
  e.stopPropagation();
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

export function setCssProperty(property: string, value: string) {
  requestAnimationFrame(() => {
    $(document.body).css({ [property]: value });
  });
}

export function waitUntil(params: {
  condition: () => MaybePromise<boolean>;
  timeout?: number;
  interval?: number;
}): Promise<void> {
  const { condition, timeout = 5000, interval = 500 } = params;

  return new Promise((resolve) => {
    const intervalId = setInterval(async () => {
      const [result, error] = await errorWrapper(condition)();
      if (!error && result === true) {
        clearInterval(intervalId);
        resolve();
      }
    }, interval);

    setTimeout(() => {
      clearInterval(intervalId);
      resolve();
    }, timeout);
  });
}

export function isSubArray(arr1: string[], arr2: string[]) {
  if (arr1.length > arr2.length) return false;

  let j = 0;
  for (let i = 0; i < arr2.length && j < arr1.length; i++) {
    if (arr1[j] === arr2[i]) {
      j++;
    }
  }

  return j === arr1.length;
}
