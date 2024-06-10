import $ from 'jquery';

export const rewriteCodeBlock = (pre: Element) => {
  if ($(pre).find('code>code').length) return;

  const code = $(pre).find('code').html();

  const wrappedCode = code
    .replace(/^(.*)$/gm, '<code>$1</code>')
    .replace(/<code><\/code>$/g, '');

  $(pre).find('code').html(wrappedCode);
};

export const updateLineCount = (pre: Element, containerIndex: number, setContainers: (callback: (draft: any) => void) => void) => {
  const code = $(pre).find('code:first').html();
  const lineCount = code.split('\n').length - 1;

  setContainers((draft) => {
    draft[containerIndex].lineCount = lineCount;
  });
};