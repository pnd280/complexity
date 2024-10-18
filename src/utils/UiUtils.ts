import { DomHelperSelectors, DomSelectors } from "@/utils/DomSelectors";
import { whereAmI } from "@/utils/utils";

export default class UiUtils {
  static isDarkTheme() {
    return $("html").attr("data-color-scheme") === "dark";
  }

  static getThreadWrapper() {
    return $(DomSelectors.THREAD.WRAPPER);
  }

  static getMessagesContainer() {
    let $messagesContainer = $(DomSelectors.THREAD.CONTAINER.NORMAL);

    if (!$messagesContainer.length) {
      $messagesContainer = $(DomSelectors.THREAD.CONTAINER.BRANCHED);
    }

    return $messagesContainer;
  }

  static getMessageBlocks(throwOnError = false) {
    const $messagesContainer = UiUtils.getMessagesContainer();

    const messageBlocks: {
      $messageBlock: JQuery<Element>;
      $answerHeading: JQuery<Element>;
      $query: JQuery<Element>;
      $answer: JQuery<Element>;
    }[] = [];

    $messagesContainer.children().each((index, messageBlock) => {
      const $messageBlock = $(messageBlock);

      $messageBlock
        .addClass(DomHelperSelectors.THREAD.MESSAGE.BLOCK.slice(1))
        .attr({ "data-index": index + 1 });

      const { $query, $answer, $answerHeading } =
        UiUtils.parseMessageBlock($messageBlock);

      if (throwOnError && (!$query.length || !$answer.length))
        throw new Error("Invalid message block");

      $messageBlock
        .find(`${DomSelectors.THREAD.MESSAGE.TEXT_COL}:last`)
        .addClass(DomHelperSelectors.THREAD.MESSAGE.TEXT_COL.slice(1));
      $messageBlock
        .find(`${DomSelectors.THREAD.MESSAGE.VISUAL_COL}:last`)
        .addClass(DomHelperSelectors.THREAD.MESSAGE.VISUAL_COL.slice(1));

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
    const $query = $messageBlock.find(
      DomSelectors.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY,
    );
    const $answer = $messageBlock.find(
      DomSelectors.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER,
    );
    const $answerHeading = $messageBlock.find(
      DomSelectors.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER_HEADING,
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
    const $parents = $(
      `${DomSelectors.QUERY_BOX.SUBMIT_BUTTON}:last`,
    ).parents();

    if (type === "main") {
      const $main = $parents.find(
        `${DomSelectors.QUERY_BOX.TEXTAREA.MAIN}:last`,
      );

      const $collection = $parents.find(
        `${DomSelectors.QUERY_BOX.TEXTAREA.COLLECTION}:last`,
      );

      return (
        $main.length ? $main : $collection
      ) as JQuery<HTMLTextAreaElement>;
    }

    if (type === "follow-up") {
      return $parents.find(
        `${DomSelectors.QUERY_BOX.TEXTAREA.FOLLOW_UP}:last`,
      ) as JQuery<HTMLTextAreaElement>;
    }

    return $parents.find(
      `${DomSelectors.QUERY_BOX.TEXTAREA.ARBITRARY}:last`,
    ) as JQuery<HTMLTextAreaElement>;
  }

  static getActiveQueryBox({ type }: { type?: "main" | "follow-up" }) {
    return UiUtils.getActiveQueryBoxTextarea({
      type,
    }).parents(DomSelectors.QUERY_BOX.WRAPPER);
  }

  static getProSearchToggle() {
    return $(DomSelectors.QUERY_BOX.PRO_SEARCH_TOGGLE);
  }

  static getStickyNavbar() {
    return $(DomSelectors.STICKY_NAVBAR);
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
    if (textarea == null) return;

    const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )?.set;

    if (nativeTextareaValueSetter) {
      nativeTextareaValueSetter.call(textarea, newValue);
    }

    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  static setReactInputValue(input: HTMLInputElement, newValue: string) {
    if (input == null) return;

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, newValue);
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));
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

  static applyRouteIdAttrs(location: ReturnType<typeof whereAmI>) {
    $(document.body).attr("location", location);
  }
}
