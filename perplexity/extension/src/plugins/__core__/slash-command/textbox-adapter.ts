import { slashCommandMenuStore } from "@/plugins/__core__/slash-command/store";
import { isLexical } from "@/plugins/__ui-groups__/elements/query-box/utils";
import { scrollIntoCaretView } from "@/utils/dom-utils/generics";
import * as lexicalUtils from "@/utils/dom-utils/lexical-utils";
import * as textareaUtils from "@/utils/dom-utils/textarea-utils";

type TextboxUtils = typeof lexicalUtils | typeof textareaUtils;

function getUtils(element: HTMLElement): TextboxUtils {
  return isLexical(element) ? lexicalUtils : textareaUtils;
}

export function createTextboxAdapter(element: HTMLElement) {
  const utils = getUtils(element);

  const selectiveScrollIntoCaretView = () => {
    if (isLexical(element)) {
      lexicalUtils.scrollIntoCaretView(element);
    } else {
      scrollIntoCaretView(element as HTMLTextAreaElement);
    }
  };

  const deleteSelectedText = () => {
    if (isLexical(element)) {
      requestAnimationFrame(() => {
        lexicalUtils.deleteSelectedText(element);
      });
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
      utils.insertText(
        element as HTMLTextAreaElement,
        text,
        slashCommandMenuStore.getState().bufferTextCaretPosition ?? undefined,
      );
    } else {
      utils.insertText(element as HTMLTextAreaElement, text);
    }

    selectiveScrollIntoCaretView();
  };

  return {
    setSelection: (selection?: { start: number; end: number } | null) => {
      const position = selection ?? {
        start: getTextLength(),
        end: getTextLength(),
      };
      utils.setSelection(element as any, position.start, position.end);
    },
    getWordAtCaret: () => utils.getWordAtCaret(element as any),
    getSelection: () => utils.getSelection(element as any),
    insertText,
    deleteTriggerPhrase: () => {
      const { start, end } = utils.getWordAtCaret(element as any);
      utils.setSelection(element as any, start, end);
      deleteSelectedText();
    },
    scrollIntoCaretView: selectiveScrollIntoCaretView,
  };
}
