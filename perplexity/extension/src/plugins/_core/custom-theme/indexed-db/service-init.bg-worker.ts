import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  LocalThemesServiceImpl,
  type LocalThemesService,
} from "@/plugins/_core/custom-theme/indexed-db";
import { isBackgroundScript } from "@/utils/utils";

let rootServiceInstance: LocalThemesService | undefined;
let proxyServiceInstance: LocalThemesService | undefined;

const [registerService, getService] = defineProxy(getLocalThemesRootService, {
  namespace: backgroundProxyServiceName,
  backup: false,
});

export function getLocalThemesRootService(): LocalThemesService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getLocalThemesProxyService instead.",
  );

  rootServiceInstance ??= LocalThemesServiceImpl;

  return rootServiceInstance;
}

export function getLocalThemesProxyService(): LocalThemesService {
  invariant(
    !isBackgroundScript(),
    "Use getLocalThemesRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export function getLocalThemesService(): LocalThemesService {
  return isBackgroundScript()
    ? getLocalThemesRootService()
    : getLocalThemesProxyService();
}

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
