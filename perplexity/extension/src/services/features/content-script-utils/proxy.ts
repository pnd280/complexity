import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  type ContentScriptBgUtilsService,
} from "@/services/features/content-script-utils";
import { isBackgroundScript } from "@/utils/utils";

const [, getService] = defineProxy(
  () => ({}) as typeof ContentScriptBgUtilsService,
  {
    namespace: backgroundProxyServiceName,
  },
);

let proxyServiceInstance: typeof ContentScriptBgUtilsService | undefined;

export function getContentScriptBgUtilsProxyService(): typeof ContentScriptBgUtilsService {
  invariant(
    !isBackgroundScript(),
    "Use getContentScriptBgUtilsRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}
