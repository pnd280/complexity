import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  MarkmapRendererServiceImpl,
  type MarkmapRendererService as MarkmapRendererServiceType,
} from "@/plugins/_core/main-world/markmap-renderer/service";
import { isInContentScript } from "@/utils/misc/utils";
import { getDocumentAdapter } from "@/utils/wrappers/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/wrappers/comctx/types";

let rootServiceInstance: MarkmapRendererServiceType | undefined;
let proxyServiceInstance: MarkmapRendererServiceType | undefined;

const [registerService, getService] = defineProxy(
  getMarkmapRendererRootService,
  {
    namespace: mainWorldProxyServiceName,
    backup: false,
  },
);

function getMarkmapRendererRootService(): MarkmapRendererServiceType {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "This method is only allowed in main world, use getMarkmapRendererProxyService instead.",
  );

  rootServiceInstance ??= MarkmapRendererServiceImpl.getInstance();

  return rootServiceInstance;
}

function getMarkmapRendererProxyService(): ComctxProxy<MarkmapRendererServiceType> {
  invariant(
    !isMainWorldContext(),
    "Use getMarkmapRendererRootService to access the non-proxied instance in main world.",
  );

  proxyServiceInstance ??= getService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<MarkmapRendererServiceType>;
}

export const MarkmapRendererService = {
  get Root() {
    return getMarkmapRendererRootService();
  },
  get Proxy() {
    return getMarkmapRendererProxyService();
  },
  get Instance(): ComctxProxy<MarkmapRendererServiceType> {
    return isMainWorldContext()
      ? (getMarkmapRendererRootService() as any)
      : getMarkmapRendererProxyService();
  },
};

export default function registerProxyService() {
  registerService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  MarkmapRendererServiceImpl.getInstance().initialize();
}
