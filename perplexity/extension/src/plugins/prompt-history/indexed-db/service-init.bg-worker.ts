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
  heartbeatCheck: false,
});

function getPromptHistoryRootService(): PromptHistoryServiceType {
  invariant(isBackgroundScript(), "[PromptHistoryService] Invalid context");

  rootServiceInstance ??= PromptHistoryServiceImpl;

  return rootServiceInstance;
}

function getPromptHistoryProxyService(): PromptHistoryServiceType {
  invariant(!isBackgroundScript(), "[PromptHistoryService] Invalid context");

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
