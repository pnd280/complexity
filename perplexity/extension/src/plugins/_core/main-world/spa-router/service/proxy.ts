import { getDocumentAdapter } from "@/utils/comctx/get-document-adapter";
import { defineProxy } from "comctx";

import { mainWorldProxyServiceName } from "@/plugins/_core/main-world/spa-router/service";
import type { SpaRouterService } from "@/plugins/_core/main-world/spa-router/service";
import type { ComctxProxy } from "@/utils/comctx/types";

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
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<
    typeof SpaRouterService
  >;
}
