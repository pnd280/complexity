import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  type PromptHistoryService,
} from "@/plugins/prompt-history/indexed-db";
import { isBackgroundScript } from "@/utils/utils";

const [, getService] = defineProxy(() => ({}) as PromptHistoryService, {
  namespace: backgroundProxyServiceName,
});

let proxyServiceInstance: PromptHistoryService | undefined;

export function getPromptHistoryProxyService(): PromptHistoryService {
  invariant(
    !isBackgroundScript(),
    "Use getPromptHistoryService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}
