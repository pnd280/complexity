import DomPurify from "dompurify";
import $ from "jquery";
import showdown from "showdown";

import BackgroundScript from "@/utils/BackgroundScript";
import UiUtils from "@/utils/UiUtils";

export const jsonUtils = {
  unescape(escapedJson: string) {
    return (
      escapedJson
        .replace(/\\\\/g, "\\") // backslashes
        // eslint-disable-next-line no-useless-escape
        .replace(/\\\"/g, '"') // double quotes
        .replace(/\\n/g, "\n") // newlines
        .replace(/\\r/g, "\r") // carriage returns
        .replace(/\\t/g, "\t") // tabs
        .replace(/\\b/g, "\b") // backspaces
        .replace(/\\f/g, "\f")
    ); // form feeds
  },
  escape(json: string) {
    return json
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\f/g, "\\f");
  },
  safeParse(json: string) {
    try {
      return JSON.parse(json);
    } catch (error) {
      return null;
    }
  },
};

/**
 * Compares two version strings.
 * @param {string} v1 - The first version string.
 * @param {string} v2 - The second version string.
 * @returns {number} Returns 1 if v1 is greater, -1 if v2 is greater, or 0 if they are equal.
 */
export function compareVersions(v1: string, v2: string): number {
  if (!isValidVersionString(v1) || !isValidVersionString(v2))
    throw new Error("Invalid version string");

  const v1Parts = v1.split(".").map(Number);
  const v2Parts = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const part1 = v1Parts[i] || 0;
    const part2 = v2Parts[i] || 0;

    if (part1 !== part2) {
      return part1 > part2 ? 1 : -1;
    }
  }

  return 0;
}

export function isValidVersionString(version: string) {
  return /^\d+\.\d+\.\d+\.\d+$/.test(version);
}

export function waitForNextjsHydration() {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const nextDataElement = $("#__NEXT_DATA__");
      const nextContainer = $("#__next");

      if (nextDataElement && nextContainer) {
        if (isMainWorldContext() && !window?.next?.router?.push) return;

        clearInterval(checkInterval);
        resolve(null);
      }
    }, 100);
  });
}

export function escapeHtmlTags(html: string) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function markdown2Html(markdown: string) {
  const unescapeHtmlTags = (html: string) => {
    return html.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  };

  const converter = new showdown.Converter();
  converter.setOption("tables", true);
  converter.setOption("simpleLineBreaks", true);

  const html = converter.makeHtml(escapeHtmlTags(markdown));

  const $tag = $("<div>").html(html);

  $tag.find("*").each((_, e) => {
    const tagName = e.tagName.toLowerCase();

    if (tagName === "code") {
      const code = $(e).text();
      $(e).html(escapeHtmlTags(unescapeHtmlTags(code)));
    }
  });

  return DomPurify.sanitize($tag.html());
}

export function stripHtml(html: string | undefined) {
  if (!html) {
    return "";
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

export function calculateRenderLines(
  text: string,
  containerWidth: number,
  fontFamily: string,
  fontSize: number,
): number {
  // Create a temporary canvas element
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const context: CanvasRenderingContext2D | null = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to get 2D context");
  }

  // Set the font properties
  context.font = `${fontSize}px ${fontFamily}`;

  // Split the text into words
  const words: string[] = text.split(" ");
  let line: string = "";
  let lines: number = 1;

  // Iterate over each word
  for (let i = 0; i < words.length; i++) {
    const testLine: string = line + words[i] + " ";
    const metrics: TextMetrics = context.measureText(testLine);

    // If the test line is wider than the container, start a new line
    if (metrics.width > containerWidth) {
      lines++;
      line = words[i] + " ";
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
  duration = 500,
) {
  const $stickyHeader = UiUtils.getStickyNavbar();

  if ($stickyHeader.length) {
    offset -= $stickyHeader.height() || 0;
  }

  const elementPosition = $anchor.offset()?.top;
  const scrollPosition = (elementPosition || 0) + offset;

  $("html, body").animate(
    {
      scrollTop: scrollPosition,
    },
    duration,
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
  const response = await BackgroundScript.sendMessage({ action: "getTabId" });
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
  queryParams: Record<string, string>;
};

export function parseUrl(url: string): ParsedUrl {
  const parsedUrl: ParsedUrl = {
    hostname: "",
    pathname: "",
    search: "",
    hash: "",
    queryParams: {},
  };

  try {
    const urlObject = new URL(url);

    parsedUrl.hostname = urlObject.hostname;
    parsedUrl.pathname = urlObject.pathname;
    parsedUrl.search = urlObject.search;
    parsedUrl.hash = urlObject.hash.slice(1);

    urlObject.searchParams.forEach((value, key) => {
      parsedUrl.queryParams[key] = value;
    });
  } catch (error) {
    console.error("Invalid URL:", error);
  }

  return parsedUrl;
}

export function whereAmI(providedUrl?: string) {
  const url = parseUrl(providedUrl || window.location.href);

  const hostname = url.hostname;
  const pathname = url.pathname;

  if (hostname === "www.perplexity.ai") {
    switch (true) {
      case pathname.startsWith("/collections"):
        return "collection";
      case pathname.startsWith("/search"):
        return "thread";
      case pathname.startsWith("/page"):
        return "page";
      case pathname.startsWith("/library"):
        return "library";
      case pathname === "/":
        return "home";
      default:
        return "unknown";
    }
  }

  return "unknown";
}

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

      if (element) {
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

export async function getPplxBuildId() {
  const NEXTDATA = await getNEXTDATA();

  return NEXTDATA.buildId;
}

export async function getNEXTDATA() {
  while (!$("script#__NEXT_DATA__").text().includes('"buildId":')) {
    await sleep(100);
  }

  return jsonUtils.safeParse($("script#__NEXT_DATA__").text());
}

export const isMainWorldContext = () => {
  return (
    typeof chrome === "undefined" ||
    typeof chrome.storage === "undefined" ||
    typeof chrome.storage.local === "undefined"
  );
};

export async function injectMainWorldScript({
  url,
  head = true,
  inject = true,
}: {
  url: string;
  head?: boolean;
  inject?: boolean;
}) {
  if (!inject) return;

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
