export type TextboxSelection = {
  start: number;
  end: number;
  value: string;
};

export function setSelection(
  textarea: HTMLTextAreaElement,
  start: number,
  end: number,
): void {
  textarea.focus();
  textarea.setSelectionRange(start, end);
}

export function getSelection(textarea: HTMLTextAreaElement): TextboxSelection {
  return {
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
    value: textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd,
    ),
  };
}

export function insertText(
  textarea: HTMLTextAreaElement,
  text: string,
  _position?: number,
): void {
  textarea.focus();
  document.execCommand("insertText", false, text);
}

export function deleteSelectedText(textarea: HTMLTextAreaElement): void {
  textarea.focus();
  document.execCommand("delete", false, "");
}

export function getWordAtCaret(textarea: HTMLTextAreaElement) {
  const { start, end, value: text } = getSelection(textarea);

  if (start !== end) {
    return {
      value: text.substring(start, end),
      start: start,
      end: end,
    };
  }

  const wordStart = text.slice(0, start).search(/\S+$/);
  const wordEnd = text.slice(start).search(/\s/);

  return {
    value: text.substring(
      wordStart,
      wordEnd === -1 ? text.length : start + wordEnd,
    ),
    start: wordStart,
    end: wordEnd === -1 ? text.length : start + wordEnd,
  };
}
