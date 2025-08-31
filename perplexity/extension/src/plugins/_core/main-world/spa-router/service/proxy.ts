import { DocumentAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import { mainWorldProxyServiceName } from "@/plugins/_core/main-world/spa-router/service";
import type { SpaRouterService } from "@/plugins/_core/main-world/spa-router/service";
import type { ComctxProxy } from "@/utils/comctx-async-proxy";

const [, getService] = defineProxy(() => ({}) as typeof SpaRouterService, {
  namespace: mainWorldProxyServiceName,
});

let proxyServiceInstance: typeof SpaRouterService | undefined;

export function getSpaRouterProxyService(): ComctxProxy<
  typeof SpaRouterService
> {
  invariant(
    !isMainWorldContext(),
    "Use getSpaRouterRootService to access the non-proxied instance in main world.",
  );

  proxyServiceInstance ??= getService(
    new DocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<
    typeof SpaRouterService
  >;
}
