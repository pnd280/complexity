import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  InstantCssStorageServiceImpl,
  type InstantCssStorageService as InstantCssStorageServiceType,
} from "@/services/features/instant-css/storage";
import { invariant, isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: InstantCssStorageServiceType | undefined;
let proxyServiceInstance: InstantCssStorageServiceType | undefined;

const [registerService, getService] = defineProxy(
  getInstantCssStorageRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

function getInstantCssStorageRootService(): InstantCssStorageServiceType {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getInstantCssStorageProxyService instead.",
  );

  rootServiceInstance ??= InstantCssStorageServiceImpl;

  return rootServiceInstance;
}

function getInstantCssStorageProxyService(): InstantCssStorageServiceType {
  invariant(
    !isBackgroundScript(),
    "Use getInstantCssStorageRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export const InstantCssStorageService = {
  get Root() {
    return getInstantCssStorageRootService();
  },
  get Proxy() {
    return getInstantCssStorageProxyService();
  },
  get Instance() {
    return isBackgroundScript()
      ? getInstantCssStorageRootService()
      : getInstantCssStorageProxyService();
  },
};

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
