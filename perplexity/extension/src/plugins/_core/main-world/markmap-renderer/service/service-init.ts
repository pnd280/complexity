import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  MarkmapRendererServiceImpl,
  type MarkmapRendererService,
} from "@/plugins/_core/main-world/markmap-renderer/service";
import { getDocumentAdapter } from "@/utils/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/comctx/types";
import { isInContentScript } from "@/utils/utils";

let rootServiceInstance: MarkmapRendererService | undefined;
let proxyServiceInstance: MarkmapRendererService | undefined;

const [registerService, getService] = defineProxy(
  getMarkmapRendererRootService,
  {
    namespace: mainWorldProxyServiceName,
    backup: false,
  },
);

export function getMarkmapRendererRootService(): MarkmapRendererService {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "This method is only allowed in main world, use getMarkmapRendererProxyService instead.",
  );

  rootServiceInstance ??= MarkmapRendererServiceImpl.getInstance();

  return rootServiceInstance;
}

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

export function getMarkmapRendererService(): ComctxProxy<MarkmapRendererService> {
  return isMainWorldContext()
    ? (getMarkmapRendererRootService() as any)
    : getMarkmapRendererProxyService();
}

export default function registerProxyService() {
  registerService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  MarkmapRendererServiceImpl.getInstance().initialize();
}
