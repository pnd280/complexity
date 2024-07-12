import $ from 'jquery';

// currently only used for preventing layout shift
// TODO: extend this to plugin system

$(() => {
  populateDataAttrs();

  const originalAppendChild = Node.prototype.appendChild;

  Node.prototype.appendChild = function <T extends Node>(newNode: T): T {
    if (newNode instanceof HTMLPreElement) {
      addDataAttr(newNode);
    } else if (
      newNode instanceof HTMLElement &&
      newNode.tagName.toLowerCase() === 'code' &&
      this instanceof HTMLPreElement
    ) {
      addDataAttr(newNode);
    }
    return originalAppendChild.call(this, newNode) as T;
  };
});

function getReactPropsKey(element: Element) {
  return Object.keys(element).find((key) => key.startsWith('__reactProps$'));
}

function populateDataAttrs() {
  $('pre').each((_, pre) => {
    addDataAttr(pre);
  });
}

function addDataAttr(pre: HTMLElement) {
  const propsKey = getReactPropsKey(pre);

  if (!propsKey) return;

  const props = (pre as any)[propsKey];

  if (typeof props !== 'object') return;

  const lang = extractLanguage(props);
  pre.setAttribute('data-lang', lang);
}

function extractLanguage(props: any) {
  try {
    const className = props.children?.[0]?.props?.className;
    const lang = className?.split('-')[1];
    return lang || 'text';
  } catch (e) {
    return 'text';
  }
}
