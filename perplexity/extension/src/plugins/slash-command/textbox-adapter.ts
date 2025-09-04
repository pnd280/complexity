import { isLexical } from "@/plugins/_core/ui/groups/query-box/utils";
import { slashCommandMenuStore } from "@/plugins/slash-command/store";
import * as lexicalUtils from "@/utils/lexical-utils";
import * as textareaUtils from "@/utils/textarea-utils";
import { UiUtils } from "@/utils/ui-utils";

type TextboxUtils = typeof lexicalUtils | typeof textareaUtils;

function getUtils(element: HTMLElement): TextboxUtils {
  return isLexical(element) ? lexicalUtils : textareaUtils;
}

export function createTextboxAdapter(element: HTMLElement) {
  const utils = getUtils(element);

  const scrollIntoCaretView = () => {
    if (isLexical(element)) {
      lexicalUtils.scrollIntoCaretView(element);
    } else {
      UiUtils.scrollIntoCaretView(element as HTMLTextAreaElement);
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

    scrollIntoCaretView();
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
    scrollIntoCaretView,
  };
}
