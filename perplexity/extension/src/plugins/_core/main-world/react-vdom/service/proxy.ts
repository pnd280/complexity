import { getDocumentAdapter } from "@/utils/comctx/get-document-adapter";
import { defineProxy } from "comctx";

import { mainWorldProxyServiceName } from "@/plugins/_core/main-world/react-vdom/service";
import type { ReactVdomService } from "@/plugins/_core/main-world/react-vdom/service";
import type { ComctxProxy } from "@/utils/comctx/types";

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
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<
    typeof ReactVdomService
  >;
}
