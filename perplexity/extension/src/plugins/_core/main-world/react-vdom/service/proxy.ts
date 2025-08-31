import { DocumentAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import { mainWorldProxyServiceName } from "@/plugins/_core/main-world/react-vdom/service";
import type { ReactVdomService } from "@/plugins/_core/main-world/react-vdom/service";
import type { ComctxProxy } from "@/utils/comctx-async-proxy";

const [, getService] = defineProxy(() => ({}) as typeof ReactVdomService, {
  namespace: mainWorldProxyServiceName,
});

let proxyServiceInstance: typeof ReactVdomService | undefined;

export function getReactVdomProxyService(): ComctxProxy<
  typeof ReactVdomService
> {
  invariant(
    !isMainWorldContext(),
    "Use getReactVdomRootService to access the non-proxied instance in main world.",
  );

  proxyServiceInstance ??= getService(
    new DocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<
    typeof ReactVdomService
  >;
}
