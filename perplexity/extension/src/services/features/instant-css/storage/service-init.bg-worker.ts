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
    heartbeatCheck: false,
  },
);

function getInstantCssStorageRootService(): InstantCssStorageServiceType {
  invariant(isBackgroundScript(), "[InstantCssStorageService] Invalid context");

  rootServiceInstance ??= InstantCssStorageServiceImpl;

  return rootServiceInstance;
}

function getInstantCssStorageProxyService(): InstantCssStorageServiceType {
  invariant(
    !isBackgroundScript(),
    "[InstantCssStorageService] Invalid context",
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
