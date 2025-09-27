import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  SpaRouterServiceImpl,
  type SpaRouterService,
} from "@/plugins/_core/main-world/spa-router/service";
import { isInContentScript } from "@/utils/misc/utils";
import { getDocumentAdapter } from "@/utils/wrappers/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/wrappers/comctx/types";

let rootServiceInstance: SpaRouterService | undefined;
let proxyServiceInstance: SpaRouterService | undefined;

const [registerService, getService] = defineProxy(getSpaRouterRootService, {
  namespace: mainWorldProxyServiceName,
  backup: false,
});

export function getSpaRouterRootService(): SpaRouterService {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "This method is only allowed in main world, use getSpaRouterProxyService instead.",
  );

  rootServiceInstance ??= SpaRouterServiceImpl;

  return rootServiceInstance;
}

export function getSpaRouterProxyService(): ComctxProxy<SpaRouterService> {
  invariant(
    !isMainWorldContext(),
    "Use getSpaRouterRootService to access the non-proxied instance in main world.",
  );

  proxyServiceInstance ??= getService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<SpaRouterService>;
}

export function getSpaRouterService(): ComctxProxy<SpaRouterService> {
  return isMainWorldContext()
    ? (getSpaRouterRootService() as any)
    : getSpaRouterProxyService();
}

export default function registerProxyService() {
  registerService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );
}
