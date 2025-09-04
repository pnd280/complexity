import type { TextboxSelection } from "@/utils/textarea-utils";

export function getTextContent({
  element,
  omitDecorators = false,
}: {
  element: HTMLElement;
  omitDecorators?: boolean;
}): string {
  let text = "";

  function traverse(n: Node) {
    if (n.nodeType === Node.TEXT_NODE) {
      text += n.textContent ?? "";
    } else if (n.nodeType === Node.ELEMENT_NODE) {
      const el = n as HTMLElement;

      if (el.tagName === "BR") {
        text += "\n";
      } else if (el.getAttribute("data-lexical-decorator") === "true") {
        if (!omitDecorators) {
          text += "\uFFFC";
        }
      } else {
        for (const child of n.childNodes) {
          traverse(child);
        }
      }
    }
  }

  traverse(element);
  return text;
}

export function setSelection(
  element: HTMLElement,
  start: number,
  end: number,
): void {
  element.focus();
  if (start > end) {
    [start, end] = [end, start];
  }

  const sel = window.getSelection();
  if (!sel) return;

  function getTextNodesWithOffsets(node: Node) {
    const textNodes: Array<{ node: Node; start: number; end: number }> = [];
    let offset = 0;

    function traverse(n: Node) {
      if (n.nodeType === Node.TEXT_NODE) {
        textNodes.push({
          node: n,
          start: offset,
          end: offset + (n.textContent?.length ?? 0),
        });
        offset += n.textContent?.length ?? 0;
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        const element = n as HTMLElement;

        if (element.tagName === "BR") {
          offset += 1; // Count <br> as newline character
        } else if (element.getAttribute("data-lexical-decorator") === "true") {
          // Treat lexical decorator as a single character
          offset += 1;
        } else {
          // Traverse children for regular elements
          for (const child of n.childNodes) {
            traverse(child);
          }
        }
      }
    }

    traverse(node);
    return { textNodes, totalLength: offset };
  }

  function getPositionFromOffset(
    textNodes: Array<{ node: Node; start: number; end: number }>,
    targetOffset: number,
  ) {
    if (targetOffset === 0) {
      if (textNodes.length > 0) {
        return { node: textNodes[0]?.node, offset: 0 };
      } else {
        return { node: element, offset: 0 };
      }
    }

    for (let i = 0; i < textNodes.length; i++) {
      const textNode = textNodes[i];
      if (
        targetOffset >= (textNode?.start ?? 0) &&
        targetOffset <= (textNode?.end ?? 0)
      ) {
        return {
          node: textNode?.node,
          offset: targetOffset - (textNode?.start ?? 0),
        };
      }
    }

    if (textNodes.length > 0) {
      const lastNode = textNodes[textNodes.length - 1];
      return {
        node: lastNode?.node ?? element,
        offset: lastNode?.node?.textContent?.length ?? 0,
      };
    }

    return { node: element, offset: 0 };
  }

  const { textNodes } = getTextNodesWithOffsets(element);
  const startPos = getPositionFromOffset(textNodes, start);
  const endPos = getPositionFromOffset(textNodes, end);

  try {
    const range = document.createRange();
    range.setStart(startPos?.node ?? element, startPos?.offset ?? 0);
    range.setEnd(endPos?.node ?? element, endPos?.offset ?? 0);

    sel.removeAllRanges();
    sel.addRange(range);
  } catch (error) {
    console.error("Failed to set selection:", {
      error,
      startPos,
      endPos,
    });
  }
}

export function getSelection(element: HTMLElement): TextboxSelection {
  function getTextNodesWithOffsets(node: Node) {
    const textNodes: { node: Node; start: number; end: number }[] = [];
    let offset = 0;

    function traverse(n: Node) {
      if (n.nodeType === Node.TEXT_NODE) {
        const length = n.textContent?.length ?? 0;
        textNodes.push({ node: n, start: offset, end: offset + length });
        offset += length;
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        const element = n as HTMLElement;

        if (element.tagName === "BR") {
          offset += 1;
        } else if (element.getAttribute("data-lexical-decorator") === "true") {
          // Treat lexical decorator as a single character
          offset += 1;
        } else {
          // Traverse children for regular elements
          for (const child of n.childNodes) {
            traverse(child);
          }
        }
      }
    }

    traverse(node);
    return { textNodes, totalLength: offset };
  }

  function getOffsetFromPosition(
    textNodes: { node: Node; start: number; end: number }[],
    targetNode: Node,
    targetOffset: number,
  ) {
    for (let i = 0; i < textNodes.length; i++) {
      const textNode = textNodes[i];
      if (textNode?.node === targetNode) {
        return textNode?.start + targetOffset;
      }
    }
    return 0;
  }

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) {
    return {
      start: 0,
      end: 0,
      value: getTextContent({ element }),
    };
  }

  const range = sel.getRangeAt(0);
  const { textNodes } = getTextNodesWithOffsets(element);

  const start = getOffsetFromPosition(
    textNodes,
    range.startContainer,
    range.startOffset,
  );
  const end = getOffsetFromPosition(
    textNodes,
    range.endContainer,
    range.endOffset,
  );

  const fullText = getTextContent({ element });

  return {
    start,
    end,
    value: start === end ? fullText : fullText.substring(start, end),
  };
}

export function insertText(
  element: HTMLElement,
  text: string,
  position?: number,
): void {
  if (position != null) {
    setSelection(element, position, position);
  }

  element.focus();

  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (line) {
      document.execCommand("insertText", false, line);
    }

    if (index < lines.length - 1) {
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(enterEvent);
    }
  });
}

export function deleteSelectedText(element: HTMLElement): void {
  element.focus();
  document.execCommand("insertText", false, "");
}

export function scrollIntoCaretView(_element: HTMLElement): void {
  const sel = window.getSelection();
  if (sel?.rangeCount == null) return;
  const range = sel.getRangeAt(0);
  const node = range.startContainer;
  const parentElement = node.nodeType === 3 ? node.parentNode : node;
  if (parentElement instanceof HTMLElement) {
    parentElement.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}

export function getWordAtCaret(element: HTMLElement) {
  const { start, end, value: text } = getSelection(element);

  if (start !== end) {
    return { value: text.substring(start, end), start, end };
  }

  // Find the start of the word
  let wordStart = start;
  while (wordStart > 0 && !/\s/.test(text[wordStart - 1]!)) {
    wordStart--;
  }

  // Find the end of the word
  let wordEnd = start;
  while (wordEnd < text.length && !/\s/.test(text[wordEnd]!)) {
    wordEnd++;
  }

  if (wordStart === wordEnd) {
    return { value: "", start: wordStart, end: wordEnd };
  }

  return {
    value: text.substring(wordStart, wordEnd),
    start: wordStart,
    end: wordEnd,
  };
}
