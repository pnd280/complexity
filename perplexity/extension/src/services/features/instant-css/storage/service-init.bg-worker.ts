import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  InstantCssStorageServiceImpl,
  type InstantCssStorageService,
} from "@/services/features/instant-css/storage";
import { invariant, isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: InstantCssStorageService | undefined;
let proxyServiceInstance: InstantCssStorageService | undefined;

const [registerService, getService] = defineProxy(
  getInstantCssStorageRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

export function getInstantCssStorageRootService(): InstantCssStorageService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getInstantCssStorageProxyService instead.",
  );

  rootServiceInstance ??= InstantCssStorageServiceImpl;

  return rootServiceInstance;
}

export function getInstantCssStorageProxyService(): InstantCssStorageService {
  invariant(
    !isBackgroundScript(),
    "Use getInstantCssStorageRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export function getInstantCssStorageService(): InstantCssStorageService {
  return isBackgroundScript()
    ? getInstantCssStorageRootService()
    : getInstantCssStorageProxyService();
}

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
