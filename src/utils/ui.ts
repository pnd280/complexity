import $ from "jquery";

import { whereAmI } from "./utils";

export default class UIUtils {
  static isDarkTheme() {
    return $("html").hasClass("dark");
  }

  static isChildrenNodeOverflowing({
    parent,
    child,
  }: {
    parent: Element;
    child: Element;
  }) {
    const parentRect = parent.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();

    const isXOverflowing =
      childRect.left < parentRect.left || childRect.right > parentRect.right;
    const isYOverflowing =
      childRect.top < parentRect.top || childRect.bottom > parentRect.bottom;

    return {
      isXOverflowing,
      isYOverflowing,
    };
  }

  static getThreadWrapper() {
    return $(".max-w-threadWidth");
  }

  static getMessagesContainer() {
    // user's thread
    let $messagesContainer = $(
      ".h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:first-child > div:first-child > div:first-child",
    );

    // branched thread
    if (!$messagesContainer.length) {
      $messagesContainer = $(
        ".h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:first-child > div:first-child > div:nth-child(2)",
      );
    }

    return $messagesContainer;
  }

  static getMessageBlocks() {
    if (whereAmI() !== "thread") return [];

    const $messagesContainer = UIUtils.getMessagesContainer();

    const messageBlocks: {
      $messageBlock: JQuery<Element>;
      $answerHeading: JQuery<Element>;
      $query: JQuery<Element>;
      $answer: JQuery<Element>;
    }[] = [];

    $messagesContainer.children().each((index, messageBlock) => {
      const $messageBlock = $(messageBlock);

      $messageBlock.addClass("message-block").attr({ "data-index": index + 1 });

      const { $query, $answer, $answerHeading } =
        UIUtils.parseMessageBlock($messageBlock);

      $messageBlock.find(".col-span-8:last").addClass("text-col");
      $messageBlock.find(".col-span-4:last").addClass("visual-col");

      const messageBlockData = {
        $messageBlock,
        $answerHeading,
        $query,
        $answer,
      };

      messageBlocks.push(messageBlockData);
    });

    return messageBlocks;
  }

  static parseMessageBlock($messageBlock: JQuery<Element>) {
    const $query = $messageBlock.find(".my-md.md\\:my-lg");
    const $answer = $messageBlock.find(".relative.default.font-sans.text-base");
    const $answerHeading = $messageBlock.find(
      '.mb-sm.flex.w-full.items-center.justify-between:contains("Answer")',
    );

    return {
      $messageBlock,
      $query,
      $answer,
      $answerHeading,
    };
  }

  static getActiveQueryBoxTextarea({
    type,
  }: {
    type?: "main" | "follow-up";
  }): JQuery<HTMLTextAreaElement> {
    const $parents = $('button[aria-label="Submit"]:last').parents();

    if (type === "main") {
      const $main = $parents.find(
        'textarea[placeholder="Ask anything..."]:last',
      );

      const $collection = $parents.find(
        'textarea[placeholder="New Thread"]:last',
      );

      return (
        $main.length ? $main : $collection
      ) as JQuery<HTMLTextAreaElement>;
    }

    if (type === "follow-up") {
      return $parents.find(
        'textarea[placeholder="Ask follow-up"]:last',
      ) as JQuery<HTMLTextAreaElement>;
    }

    return $parents.find(
      "textarea[placeholder]:last",
    ) as JQuery<HTMLTextAreaElement>;
  }

  static getActiveQueryBox({ type }: { type?: "main" | "follow-up" }) {
    return UIUtils.getActiveQueryBoxTextarea({
      type,
    }).parents(".grow.block");
  }

  static getStickyNavbar() {
    return $(".sticky.left-0.right-0.top-0.z-20.border-b");
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

  static setReactTextareaValue(
    textarea: HTMLTextAreaElement,
    newValue: string,
  ) {
    if (!textarea) return;

    const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )?.set;

    if (nativeTextareaValueSetter) {
      nativeTextareaValueSetter.call(textarea, newValue);
    }

    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  static getMostVisibleElementIndex(elements: Element[]) {
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

    function getVisiblePercentage(element: Element) {
      const rect = element.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const windowWidth =
        window.innerWidth || document.documentElement.clientWidth;

      // Calculate the visible part of the element
      const visibleWidth = Math.max(
        0,
        Math.min(rect.right, windowWidth) - Math.max(rect.left, 0),
      );
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0),
      );
      const visibleArea = visibleWidth * visibleHeight;
      const totalArea = rect.width * rect.height;

      return (visibleArea / totalArea) * 100;
    }
  }
}
