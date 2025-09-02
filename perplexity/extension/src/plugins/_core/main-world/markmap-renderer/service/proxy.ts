import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  type MarkmapRendererService,
} from "@/plugins/_core/main-world/markmap-renderer/service";
import { getDocumentAdapter } from "@/utils/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/comctx/types";

const [, getService] = defineProxy(() => ({}) as MarkmapRendererService, {
  namespace: mainWorldProxyServiceName,
});

let proxyServiceInstance: MarkmapRendererService | undefined;

export function getMarkmapRendererProxyService(): ComctxProxy<MarkmapRendererService> {
  invariant(
    !isMainWorldContext(),
    "Use getMarkmapRendererRootService to access the non-proxied instance in main world.",
  );

  proxyServiceInstance ??= getService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<MarkmapRendererService>;
}
