import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  LocalThemesServiceImpl,
  type LocalThemesService as LocalThemesServiceType,
} from "@/entrypoints/core-plugins/custom-themes/indexed-db/service";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: LocalThemesServiceType | undefined;
let proxyServiceInstance: LocalThemesServiceType | undefined;

const [registerService, getService] = defineProxy(getLocalThemesRootService, {
  namespace: backgroundProxyServiceName,
  backup: false,
  heartbeatCheck: true,
});

function getLocalThemesRootService(): LocalThemesServiceType {
  invariant(isBackgroundScript(), "[LocalThemesService] Invalid context");

  rootServiceInstance ??= LocalThemesServiceImpl;

  return rootServiceInstance;
}

function getLocalThemesProxyService(): LocalThemesServiceType {
  invariant(!isBackgroundScript(), "[LocalThemesService] Invalid context");

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
