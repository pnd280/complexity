import { defineProxy } from "comctx";

import {
  csProxyServiceName,
  NetworkInterceptMiddlewareManagerImpl,
  type NetworkInterceptMiddlewareManager as NetworkInterceptMiddlewareManagerType,
} from "@/plugins/__core__/_main-world/network-intercept/_service";
import { isInContentScript } from "@/utils/misc/utils";
import { getDocumentAdapter } from "@/utils/wrappers/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/wrappers/comctx/types";

let rootServiceInstance: NetworkInterceptMiddlewareManagerType | undefined;
let proxyServiceInstance: NetworkInterceptMiddlewareManagerType | undefined;

const [registerService, getService] = defineProxy(
  getNetworkInterceptMiddlewareManagerRootService,
  {
    namespace: csProxyServiceName,
    backup: false,
  },
);

function getNetworkInterceptMiddlewareManagerRootService(): NetworkInterceptMiddlewareManagerType {
  invariant(
    isInContentScript() && !isMainWorldContext(),
    "[NetworkInterceptMiddlewareManager] Invalid context",
  );

  rootServiceInstance ??= NetworkInterceptMiddlewareManagerImpl.getInstance();

  return rootServiceInstance;
}

function getNetworkInterceptMiddlewareManagerProxyService(): ComctxProxy<NetworkInterceptMiddlewareManagerType> {
  invariant(
    isMainWorldContext(),
    "[NetworkInterceptMiddlewareManager] Invalid context",
  );

  proxyServiceInstance ??= getService(
    getDocumentAdapter(`complexity:${csProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<NetworkInterceptMiddlewareManagerType>;
}

export const NetworkInterceptMiddlewareManagerService = {
  get Root() {
    return getNetworkInterceptMiddlewareManagerRootService();
  },
  get Proxy() {
    return getNetworkInterceptMiddlewareManagerProxyService();
  },
  get Instance(): ComctxProxy<NetworkInterceptMiddlewareManagerType> {
    return isMainWorldContext()
      ? getNetworkInterceptMiddlewareManagerProxyService()
      : (getNetworkInterceptMiddlewareManagerRootService() as unknown as ComctxProxy<NetworkInterceptMiddlewareManagerType>);
  },
};

export default function () {
  registerService(getDocumentAdapter(`complexity:${csProxyServiceName}`));
}
