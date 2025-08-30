import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import { backgroundProxyServiceName } from "@/services/features/instant-css/injector/constants";
import type { InstantCssInjectorService } from "@/services/features/instant-css/injector/index";
import { isBackgroundScript } from "@/utils/utils";

const [, getService] = defineProxy(
  () => ({}) as typeof InstantCssInjectorService,
  {
    namespace: backgroundProxyServiceName,
  },
);

let proxyServiceInstance: typeof InstantCssInjectorService | undefined;

export function getInstantCssInjectorProxyService(): typeof InstantCssInjectorService {
  invariant(
    !isBackgroundScript(),
    "Use getInstantCssInjectorService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}
