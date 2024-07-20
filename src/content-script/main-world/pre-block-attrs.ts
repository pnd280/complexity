import $ from 'jquery';

import Canvas from '@/utils/Canvas';
import { mainWorldExec } from '@/utils/hoc';
import MarkdownBlockUtils from '@/utils/MarkdownBlock';

function populateDataAttrs() {
  $('pre').each((_, pre) => {
    queueMicrotask(() => addDataAttr(pre));
  });
}

function addDataAttr(pre: HTMLElement) {
  if (!pre.querySelector('&>div.codeWrapper') || pre.hasAttribute('data-lang'))
    return;

  const lang = MarkdownBlockUtils.extractLanguage(pre);
  pre.setAttribute('data-lang', lang);
  pre.setAttribute('data-mask', Canvas.isMaskableLang(lang) ? 'true' : 'false');
}

mainWorldExec(() =>
  $(() => {
    populateDataAttrs();

    const originalAppendChild = Node.prototype.appendChild;

    Node.prototype.appendChild = function <T extends Node>(newNode: T): T {
      if (newNode instanceof HTMLPreElement) {
        addDataAttr(newNode);
      }

      return originalAppendChild.call(this, newNode) as T;
    };
  })
)();
