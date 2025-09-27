import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  InstantCssInjectorServiceImpl,
  type InstantCssInjectorService,
} from "@/services/features/instant-css/injector";
import { invariant, isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: InstantCssInjectorService | undefined;
let proxyServiceInstance: InstantCssInjectorService | undefined;

const [registerService, getService] = defineProxy(
  getInstantCssInjectorRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

export function getInstantCssInjectorRootService(): InstantCssInjectorService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getInstantCssInjectorProxyService instead.",
  );

  rootServiceInstance ??= InstantCssInjectorServiceImpl;

  return rootServiceInstance;
}

export function getInstantCssInjectorProxyService(): InstantCssInjectorService {
  invariant(
    !isBackgroundScript(),
    "Use getInstantCssInjectorRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export function getInstantCssInjectorService(): InstantCssInjectorService {
  return isBackgroundScript()
    ? getInstantCssInjectorRootService()
    : getInstantCssInjectorProxyService();
}

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
