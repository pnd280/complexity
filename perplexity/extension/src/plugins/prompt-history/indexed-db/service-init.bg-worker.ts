import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  PromptHistoryServiceImpl,
  type PromptHistoryService as PromptHistoryServiceType,
} from "@/plugins/prompt-history/indexed-db";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: PromptHistoryServiceType | undefined;
let proxyServiceInstance: PromptHistoryServiceType | undefined;

const [registerService, getService] = defineProxy(getPromptHistoryRootService, {
  namespace: backgroundProxyServiceName,
  backup: false,
});

function getPromptHistoryRootService(): PromptHistoryServiceType {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getPromptHistoryProxyService instead.",
  );

  rootServiceInstance ??= PromptHistoryServiceImpl;

  return rootServiceInstance;
}

function getPromptHistoryProxyService(): PromptHistoryServiceType {
  invariant(
    !isBackgroundScript(),
    "Use getPromptHistoryRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export const PromptHistoryService = {
  get Root() {
    return getPromptHistoryRootService();
  },
  get Proxy() {
    return getPromptHistoryProxyService();
  },
  get Instance() {
    return isBackgroundScript()
      ? getPromptHistoryRootService()
      : getPromptHistoryProxyService();
  },
};

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
