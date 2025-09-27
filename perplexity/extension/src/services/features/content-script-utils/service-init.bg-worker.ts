import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  ContentScriptBgUtilsServiceImpl,
  type ContentScriptBgUtilsService as ContentScriptBgUtilsServiceType,
} from "@/services/features/content-script-utils";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: ContentScriptBgUtilsServiceType | undefined;
let proxyServiceInstance: ContentScriptBgUtilsServiceType | undefined;

const [registerService, getService] = defineProxy(
  getContentScriptBgUtilsRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

function getContentScriptBgUtilsRootService(): ContentScriptBgUtilsServiceType {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getContentScriptBgUtilsProxyService instead.",
  );

  rootServiceInstance ??= ContentScriptBgUtilsServiceImpl;

  return rootServiceInstance;
}

function getContentScriptBgUtilsProxyService(): ContentScriptBgUtilsServiceType {
  invariant(
    !isBackgroundScript(),
    "Use getContentScriptBgUtilsRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export const ContentScriptBgUtilsService = {
  get Root() {
    return getContentScriptBgUtilsRootService();
  },
  get Proxy() {
    return getContentScriptBgUtilsProxyService();
  },
  get Instance() {
    return isBackgroundScript()
      ? getContentScriptBgUtilsRootService()
      : getContentScriptBgUtilsProxyService();
  },
};

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
