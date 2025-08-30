import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  type InstantCssStorageService,
} from "@/services/features/instant-css/storage";
import { isBackgroundScript } from "@/utils/utils";

const [, getService] = defineProxy(
  () => ({}) as typeof InstantCssStorageService,
  {
    namespace: backgroundProxyServiceName,
  },
);

let proxyServiceInstance: typeof InstantCssStorageService | undefined;

export function getInstantCssStorageProxyService(): typeof InstantCssStorageService {
  invariant(
    !isBackgroundScript(),
    "Use getInstantCssStorageService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}
