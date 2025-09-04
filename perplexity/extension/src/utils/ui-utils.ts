import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";
import { getCookie } from "@/utils/utils";

export class UiUtils {
  static getCurrentColorScheme(): "dark" | "light" {
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

  static getStickyNavbar() {
    return $(DomSelectorsService.cachedSync.STICKY_NAVBAR);
  }

  static getWordOnCaret(element: HTMLTextAreaElement) {
    const text = element.value;
    const caret = element.selectionStart;

    if (!text || caret === undefined) {
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

  static waitForSpaIdle(): Promise<boolean> {
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
        console.log(
          "[WaitForSpaIdle] Timeout reached, disconnecting observer.",
        );
        observer.disconnect();
        resolve(true);
      }, IDLE_TIMEOUT);
    });
  }

  static scrollIntoCaretView(textarea: HTMLTextAreaElement) {
    const currentCaretPosition = textarea.selectionStart;

    $(textarea).trigger("blur");
    $(textarea).trigger("focus");

    textarea.selectionStart = currentCaretPosition;
    textarea.selectionEnd = currentCaretPosition;
  }
}
