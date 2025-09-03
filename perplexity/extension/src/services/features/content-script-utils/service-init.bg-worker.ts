import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  ContentScriptBgUtilsServiceImpl,
  type ContentScriptBgUtilsService,
} from "@/services/features/content-script-utils";
import { isBackgroundScript } from "@/utils/utils";

let rootServiceInstance: ContentScriptBgUtilsService | undefined;
let proxyServiceInstance: ContentScriptBgUtilsService | undefined;

const [registerService, getService] = defineProxy(
  getContentScriptBgUtilsRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

export function getContentScriptBgUtilsRootService(): ContentScriptBgUtilsService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getContentScriptBgUtilsProxyService instead.",
  );

  rootServiceInstance ??= ContentScriptBgUtilsServiceImpl;

  return rootServiceInstance;
}

export function getContentScriptBgUtilsProxyService(): ContentScriptBgUtilsService {
  invariant(
    !isBackgroundScript(),
    "Use getContentScriptBgUtilsRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export function getContentScriptBgUtilsService(): ContentScriptBgUtilsService {
  return isBackgroundScript()
    ? getContentScriptBgUtilsRootService()
    : getContentScriptBgUtilsProxyService();
}

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
