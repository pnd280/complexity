import $ from 'jquery';

import Canvas from '@/utils/Canvas';
import { mainWorldExec } from '@/utils/hoc';
import MarkdownBlockUtils from '@/utils/MarkdownBlock';

function applyDataAttrs() {
  $('pre').each((_, pre) => {
    queueMicrotask(() => addDataAttrs(pre));
  });
}

function addDataAttrs(pre: HTMLElement) {
  if (!pre.querySelector('&>div.codeWrapper') || pre.hasAttribute('data-lang'))
    return;

  const lang = MarkdownBlockUtils.extractLanguage(pre);
  pre.setAttribute('data-lang', lang);
  pre.setAttribute('data-mask', Canvas.isMaskableLang(lang) ? 'true' : 'false');
}

mainWorldExec(() => {
  $(() => {
    applyDataAttrs();
    proxyDOMMethods();
  });
})();

function proxyDOMMethods() {
  // Why override native methods?
  // To prevent layout shift: current DOMObserver implementation doesnt guarantee to react to DOM changes before they are painted on the screen => layout shift when apply new styles.

  const originalAppendChild = Node.prototype.appendChild;

  Node.prototype.appendChild = function <T extends Node>(newNode: T): T {
    if (newNode instanceof HTMLPreElement) {
      addDataAttrs(newNode);
    }

    return originalAppendChild.call(this, newNode) as T;
  };
}
