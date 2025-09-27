import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  InstantCssInjectorServiceImpl,
  type InstantCssInjectorService as InstantCssInjectorServiceType,
} from "@/services/features/instant-css/injector";
import { invariant, isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: InstantCssInjectorServiceType | undefined;
let proxyServiceInstance: InstantCssInjectorServiceType | undefined;

const [registerService, getService] = defineProxy(
  getInstantCssInjectorRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

function getInstantCssInjectorRootService(): InstantCssInjectorServiceType {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getInstantCssInjectorProxyService instead.",
  );

  rootServiceInstance ??= InstantCssInjectorServiceImpl;

  return rootServiceInstance;
}

function getInstantCssInjectorProxyService(): InstantCssInjectorServiceType {
  invariant(
    !isBackgroundScript(),
    "Use getInstantCssInjectorRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export const InstantCssInjectorService = {
  get Root() {
    return getInstantCssInjectorRootService();
  },
  get Proxy() {
    return getInstantCssInjectorProxyService();
  },
  get Instance() {
    return isBackgroundScript()
      ? getInstantCssInjectorRootService()
      : getInstantCssInjectorProxyService();
  },
};

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
