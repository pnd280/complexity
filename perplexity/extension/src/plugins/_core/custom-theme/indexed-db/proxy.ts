import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import type { LocalThemesService } from "@/plugins/_core/custom-theme/indexed-db";
import { backgroundProxyServiceName } from "@/plugins/_core/custom-theme/indexed-db";
import { isBackgroundScript } from "@/utils/utils";

const [, getService] = defineProxy(() => ({}) as LocalThemesService, {
  namespace: backgroundProxyServiceName,
});

let proxyServiceInstance: LocalThemesService | undefined;

export function getLocalThemesProxyService(): LocalThemesService {
  invariant(
    !isBackgroundScript(),
    "Use getLocalThemesService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}
