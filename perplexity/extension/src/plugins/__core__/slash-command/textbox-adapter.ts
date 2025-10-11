import { slashCommandMenuStore } from "@/plugins/__core__/slash-command/store";
import { isLexical } from "@/plugins/__ui-groups__/elements/query-box/utils";
import { scrollIntoCaretView } from "@/utils/dom-utils/generics";
import * as lexicalUtils from "@/utils/dom-utils/lexical-utils";
import * as textareaUtils from "@/utils/dom-utils/textarea-utils";

export function createTextboxAdapter(
  element: HTMLElement | HTMLTextAreaElement,
) {
  const selectiveScrollIntoCaretView = () => {
    if (isLexical(element)) {
      lexicalUtils.scrollIntoCaretView(element);
    } else {
      scrollIntoCaretView(element as HTMLTextAreaElement);
    }
  };

  const deleteSelectedText = () => {
    if (isLexical(element)) {
      setTimeout(() => {
        lexicalUtils.deleteSelectedText(element);
      }, 0);
    } else {
      textareaUtils.deleteSelectedText(element as HTMLTextAreaElement);
    }
  };

  const getTextLength = () => {
    return isLexical(element)
      ? (element.innerText?.replace(/^\n\s/, "").length ?? 0)
      : (element as HTMLTextAreaElement).value.length;
  };

  const insertText = (text: string) => {
    if (isLexical(element)) {
      lexicalUtils.insertText(
        element,
        text,
        slashCommandMenuStore.getState().bufferTextCaretPosition ?? undefined,
      );
    } else {
      textareaUtils.insertText(element as HTMLTextAreaElement, text);
    }

    selectiveScrollIntoCaretView();
  };

  const utils: typeof lexicalUtils = isLexical(element)
    ? lexicalUtils
    : (textareaUtils as typeof lexicalUtils);

  return {
    setSelection: (selection?: { start: number; end: number } | null) => {
      const position = selection ?? {
        start: getTextLength(),
        end: getTextLength(),
      };
      utils.setSelection(element, position.start, position.end);
    },
    getWordAtCaret: () => utils.getWordAtCaret(element),
    getSelection: () => utils.getSelection(element),
    insertText,
    deleteTriggerPhrase: () => {
      const { start, end } = utils.getWordAtCaret(element);
      utils.setSelection(element, start, end);
      deleteSelectedText();
    },
    scrollIntoCaretView: selectiveScrollIntoCaretView,
  };
}
