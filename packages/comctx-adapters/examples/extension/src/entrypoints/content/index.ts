import defineProxy from "comctx";

import { BrowserRuntimeAdapter } from "@/adapters/browser";
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
  const tabId = await chrome.runtime.sendMessage({
    type: "getTabId",
  });

  if (tabId == null) return;

  const [registerService] = defineProxy(() => new CounterService(), {
    namespace: `content-counter@${tabId}`,
  });

  const contentService = registerService(new BrowserRuntimeAdapter());

  contentService.onChange((value) => {
    console.log(value);
  });

  chrome.runtime.sendMessage({
    type: "registerBridgeService",
    details: {
      namespace: `content-counter@${tabId}`,
    },
  });

  if (tabId !== 1581720153) {
    // In different tabs, use the bridged service of tab 1581720153 from the background script
    const [, getContentServiceFromAnotherTab] = defineProxy(
      () => ({}) as CounterService,
      {
        namespace: `content-counter@1581720153`,
      },
    );

    const contentServiceFromAnotherTab = getContentServiceFromAnotherTab(
      new BrowserRuntimeAdapter(),
    );

    contentServiceFromAnotherTab.increment();
  }
})();
