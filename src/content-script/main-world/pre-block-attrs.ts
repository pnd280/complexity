import $ from "jquery";

import Canvas from "@/utils/Canvas";
import { extensionOnly, mainWorldExec } from "@/utils/hof";
import MarkdownBlockUtils from "@/utils/MarkdownBlock";

function applyDataAttrs() {
  $("pre").each((_, pre) => {
    queueMicrotask(() => addDataAttrs(pre));
  });

  $(document.body).attr("data-pre-block-initial-attrs-applied", "true");
}

function addDataAttrs(pre: HTMLElement) {
  if (!pre.querySelector("&>div.codeWrapper") || pre.hasAttribute("data-lang"))
    return;

  const lang = MarkdownBlockUtils.getLangFromReactNode(pre);

  if (!lang) return;

  pre.setAttribute("data-lang", lang);
  pre.setAttribute("data-mask", Canvas.isMaskableLang(lang) ? "true" : "false");
}

mainWorldExec(() => {
  $(() => {
    queueMicrotask(applyDataAttrs);
    queueMicrotask(proxyDomMethods);
  });
})();

function proxyDomMethods() {
  // Why override native methods?
  // To prevent layout shift: current DomObserver implementation doesnt guarantee to react to Dom changes before they are painted on the screen => layout shift when apply new styles.

  const originalAppendChild = Node.prototype.appendChild;

  Node.prototype.appendChild = function <T extends Node>(newNode: T): T {
    if (newNode instanceof HTMLPreElement) {
      addDataAttrs(newNode);
    }

    return originalAppendChild.call(this, newNode) as T;
  };

  $(document.body).attr("data-pre-block-dom-methods-overridden", "true");
}

export const preBlockAttrsContentScript = {
  waitForInitialization: extensionOnly(function () {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (
          document.body.getAttribute("data-pre-block-initial-attrs-applied") &&
          document.body.getAttribute("data-pre-block-dom-methods-overridden")
        ) {
          interval != null && clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }),
};
