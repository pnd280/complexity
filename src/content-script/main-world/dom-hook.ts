import $ from 'jquery';

import { isMainWorldContext } from '@/utils/utils';

function getReactPropsKey(element: Element) {
  return Object.keys(element).find((key) => key.startsWith('__reactProps$'));
}

function populateDataAttrs() {
  $('pre').each((_, pre) => {
    queueMicrotask(() => addDataAttr(pre));
  });
}

function addDataAttr(pre: HTMLElement) {
  if (!pre.querySelector('&>div.codeWrapper') || pre.hasAttribute('data-lang'))
    return;

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

// currently only used for preventing layout shift
// TODO: extend this to plugin system

if (isMainWorldContext()) {
  $(() => {
    populateDataAttrs();

    const originalAppendChild = Node.prototype.appendChild;

    Node.prototype.appendChild = function <T extends Node>(newNode: T): T {
      if (newNode instanceof HTMLPreElement) {
        addDataAttr(newNode);
      }

      return originalAppendChild.call(this, newNode) as T;
    };
  });
}
