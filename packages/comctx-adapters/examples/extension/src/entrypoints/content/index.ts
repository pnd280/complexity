import { ChromiumDocumentAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import { CounterService } from "@/services/counter";

// @ts-ignore
import mainWorldScript from "@/entrypoints/content/index.main-world?script&module";

injectMainWorldScript({
  url: chrome.runtime.getURL(mainWorldScript),
  head: true,
  inject: true,
});

export async function injectMainWorldScript({
  url,
  head = true,
  inject = true,
}: {
  url: string;
  head?: boolean;
  inject?: boolean;
}) {
  if (!inject) return;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = url;
    script.onload = () => resolve(null);
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));

    if (head) {
      document.head.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
  });
}

// CONTENT SCRIPT

(async () => {
  const [registerService] = defineProxy(() => new CounterService(), {
    namespace: "counter",
  });

  registerService(new ChromiumDocumentAdapter("counter"));
})();
