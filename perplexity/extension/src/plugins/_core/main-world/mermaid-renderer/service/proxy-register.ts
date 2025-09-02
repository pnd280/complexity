import { getDocumentAdapter } from "@/utils/comctx/get-document-adapter";
import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  MermaidRendererService,
} from "@/plugins/_core/main-world/mermaid-renderer/service";
import { isInContentScript } from "@/utils/utils";

let serviceInstance: MermaidRendererService | undefined;

export function getMermaidRendererRootService(): MermaidRendererService {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "This method is only allowed in main world, use getMermaidRendererProxyService instead.",
  );

  serviceInstance ??= MermaidRendererService.getInstance();

  return serviceInstance;
}

export default function registerProxyService() {
  const [registerService] = defineProxy(getMermaidRendererRootService, {
    namespace: mainWorldProxyServiceName,
  });

  registerService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  MermaidRendererService.getInstance().initialize();
}
