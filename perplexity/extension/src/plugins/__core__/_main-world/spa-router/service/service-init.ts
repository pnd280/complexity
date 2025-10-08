import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  SpaRouterServiceImpl,
  type SpaRouterService as SpaRouterServiceType,
} from "@/plugins/__core__/_main-world/spa-router/service";
import { isInContentScript } from "@/utils/misc/utils";
import { getDocumentAdapter } from "@/utils/wrappers/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/wrappers/comctx/types";

let rootServiceInstance: SpaRouterServiceType | undefined;
let proxyServiceInstance: SpaRouterServiceType | undefined;

const [registerService, getService] = defineProxy(getSpaRouterRootService, {
  namespace: mainWorldProxyServiceName,
  backup: false,
});

function getSpaRouterRootService(): SpaRouterServiceType {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "[SpaRouterService] Invalid context",
  );

  rootServiceInstance ??= SpaRouterServiceImpl;

  return rootServiceInstance;
}

function getSpaRouterProxyService(): ComctxProxy<SpaRouterServiceType> {
  invariant(!isMainWorldContext(), "[SpaRouterService] Invalid context");

  proxyServiceInstance ??= getService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<SpaRouterServiceType>;
}

export const SpaRouterService = {
  get Root() {
    return getSpaRouterRootService();
  },
  get Proxy() {
    return getSpaRouterProxyService();
  },
  get Instance(): ComctxProxy<SpaRouterServiceType> {
    return isMainWorldContext()
      ? (getSpaRouterRootService() as unknown as ComctxProxy<SpaRouterServiceType>)
      : getSpaRouterProxyService();
  },
};

export default function registerProxyService() {
  registerService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );
}
