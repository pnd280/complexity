import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  MarkmapRendererService,
} from "@/plugins/_core/main-world/markmap-renderer/service";
import { getDocumentAdapter } from "@/utils/comctx/get-document-adapter";
import { isInContentScript } from "@/utils/utils";

let serviceInstance: MarkmapRendererService | undefined;

export function getMarkmapRendererRootService(): MarkmapRendererService {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "This method is only allowed in main world, use getMarkmapRendererProxyService instead.",
  );

  serviceInstance ??= MarkmapRendererService.getInstance();

  return serviceInstance;
}

export default function registerProxyService() {
  const [registerService] = defineProxy(getMarkmapRendererRootService, {
    namespace: mainWorldProxyServiceName,
  });

  registerService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  MarkmapRendererService.getInstance().initialize();
}
