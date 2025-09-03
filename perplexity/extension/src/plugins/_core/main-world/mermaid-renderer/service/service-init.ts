import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  MermaidRendererServiceImpl,
  type MermaidRendererService,
} from "@/plugins/_core/main-world/mermaid-renderer/service";
import { getDocumentAdapter } from "@/utils/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/comctx/types";
import { isInContentScript } from "@/utils/utils";

let rootServiceInstance: MermaidRendererService | undefined;
let proxyServiceInstance: MermaidRendererService | undefined;

const [registerService, getService] = defineProxy(
  getMermaidRendererRootService,
  {
    namespace: mainWorldProxyServiceName,
    backup: false,
  },
);

export function getMermaidRendererRootService(): MermaidRendererService {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "This method is only allowed in main world, use getMermaidRendererProxyService instead.",
  );

  rootServiceInstance ??= MermaidRendererServiceImpl.getInstance();

  return rootServiceInstance;
}

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

export function getMermaidRendererService(): ComctxProxy<MermaidRendererService> {
  return isMainWorldContext()
    ? (getMermaidRendererRootService() as any)
    : getMermaidRendererProxyService();
}

export default function registerProxyService() {
  registerService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  MermaidRendererServiceImpl.getInstance().initialize();
}
