import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  LocalThemesServiceImpl,
  type LocalThemesService as LocalThemesServiceType,
} from "@/plugins/_core/custom-theme/indexed-db";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: LocalThemesServiceType | undefined;
let proxyServiceInstance: LocalThemesServiceType | undefined;

const [registerService, getService] = defineProxy(getLocalThemesRootService, {
  namespace: backgroundProxyServiceName,
  backup: false,
});

function getLocalThemesRootService(): LocalThemesServiceType {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getLocalThemesProxyService instead.",
  );

  rootServiceInstance ??= LocalThemesServiceImpl;

  return rootServiceInstance;
}

function getLocalThemesProxyService(): LocalThemesServiceType {
  invariant(
    !isBackgroundScript(),
    "Use getLocalThemesRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export const LocalThemesService = {
  get Root() {
    return getLocalThemesRootService();
  },
  get Proxy() {
    return getLocalThemesProxyService();
  },
  get Instance() {
    return isBackgroundScript()
      ? getLocalThemesRootService()
      : getLocalThemesProxyService();
  },
};

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
