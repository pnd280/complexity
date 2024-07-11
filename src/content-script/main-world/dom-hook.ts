import $ from 'jquery';

// currently only used for preventing layout shift
// TODO: extend this to plugin system

$(() => {
  const originalAppendChild = Node.prototype.appendChild;

  function addDataAttr(preElement: HTMLElement): void {
    if (preElement.hasAttribute('data-lang')) {
      return;
    }
    const lang = $(preElement).find('.border-b.border-r.font-thin').text();
    preElement.setAttribute('data-lang', lang || 'text');
  }

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
