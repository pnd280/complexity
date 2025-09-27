import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  PromptHistoryServiceImpl,
  type PromptHistoryService,
} from "@/plugins/prompt-history/indexed-db";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: PromptHistoryService | undefined;
let proxyServiceInstance: PromptHistoryService | undefined;

const [registerService, getService] = defineProxy(getPromptHistoryRootService, {
  namespace: backgroundProxyServiceName,
  backup: false,
});

export function getPromptHistoryRootService(): PromptHistoryService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getPromptHistoryProxyService instead.",
  );

  rootServiceInstance ??= PromptHistoryServiceImpl;

  return rootServiceInstance;
}

export function getPromptHistoryProxyService(): PromptHistoryService {
  invariant(
    !isBackgroundScript(),
    "Use getPromptHistoryRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export function getPromptHistoryService(): PromptHistoryService {
  return isBackgroundScript()
    ? getPromptHistoryRootService()
    : getPromptHistoryProxyService();
}

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
