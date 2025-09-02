import { getDocumentAdapter } from "@/utils/comctx/get-document-adapter";
import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  type MermaidRendererService,
} from "@/plugins/_core/main-world/mermaid-renderer/service";
import type { ComctxProxy } from "@/utils/comctx/types";

const [, getService] = defineProxy(() => ({}) as MermaidRendererService, {
  namespace: mainWorldProxyServiceName,
});

let proxyServiceInstance: MermaidRendererService | undefined;

export function getMermaidRendererProxyService(): ComctxProxy<MermaidRendererService> {
  invariant(
    !isMainWorldContext(),
    "Use getMermaidRendererRootService to access the non-proxied instance in main world.",
  );

  proxyServiceInstance ??= getService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<MermaidRendererService>;
}
