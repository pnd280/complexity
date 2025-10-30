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

export function getCurrentColorScheme(): "dark" | "light" {
  const cookieSetting = getCookie("colorScheme");
  if (cookieSetting === "dark" || cookieSetting === "light") {
    return cookieSetting;
  }

  const documentAttribute = $("html").attr("data-color-scheme");
  if (documentAttribute === "dark" || documentAttribute === "light") {
    return documentAttribute;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
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

export function getWordOnCaret(element: HTMLTextAreaElement) {
  const text = element.value;
  const caret = element.selectionStart;

  if (!text) {
    return {
      word: "",
      start: 0,
      end: 0,
      newText: "",
    };
  }

  // Find the start of the word
  let start = text.slice(0, caret).search(/\S+$/);
  if (start === -1) {
    start = caret;
  }

  // Find the end of the word
  let end = text.slice(caret).search(/\s/);
  if (end === -1) {
    end = text.length;
  } else {
    end += caret;
  }

  const word = text.slice(start, end);
  const newText = text.slice(0, start) + text.slice(end);

  return {
    word,
    start,
    end,
    newText,
  };
}

export function waitForSpaIdle(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    // const startTime = Date.now();
    // console.log("waitForSpaIdle: Start waiting for SPA to become idle.");

    const $wrapper = $(document.body);
    if (!$wrapper[0]) {
      // console.log("waitForSpaIdle: No wrapper found, resolving immediately.");
      return resolve(true);
    }

    const IDLE_TIME = 50;
    const IDLE_TIMEOUT = 3000;

    let timeout: NodeJS.Timeout;
    let isIdle = false;

    function mutationDisconnect() {
      if (isIdle) return;
      isIdle = true;

      observer.disconnect();
      // const endTime = Date.now();
      // console.log(
      //   `waitForSpaIdle: SPA became idle after ${endTime - startTime} ms.`,
      // );

      resolve(true);
    }

    function mutationFn() {
      clearTimeout(timeout);
      timeout = setTimeout(mutationDisconnect, IDLE_TIME);
    }

    const observer = new MutationObserver(mutationFn);

    observer.observe($wrapper[0], {
      childList: true,
      subtree: false,
    });

    mutationFn();

    setTimeout(() => {
      if (isIdle) return;
      console.log("[WaitForSpaIdle] Timeout reached, disconnecting observer.");
      observer.disconnect();
      resolve(true);
    }, IDLE_TIMEOUT);
  });
}

export function scrollIntoCaretView(textarea: HTMLTextAreaElement) {
  const currentCaretPosition = textarea.selectionStart;

  $(textarea).trigger("blur");
  $(textarea).trigger("focus");

  textarea.selectionStart = currentCaretPosition;
  textarea.selectionEnd = currentCaretPosition;
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

export function untrapWheel(e: React.WheelEvent<HTMLDivElement>) {
  e.stopPropagation();
}
