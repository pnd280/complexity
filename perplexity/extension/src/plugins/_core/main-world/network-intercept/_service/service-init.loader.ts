import { defineProxy } from "comctx";

import {
  csProxyServiceName,
  NetworkInterceptMiddlewareManagerImpl,
  type NetworkInterceptMiddlewareManager,
} from "@/plugins/_core/main-world/network-intercept/_service";
import { isInContentScript } from "@/utils/misc/utils";
import { getDocumentAdapter } from "@/utils/wrappers/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/wrappers/comctx/types";

let rootServiceInstance: NetworkInterceptMiddlewareManager | undefined;
let proxyServiceInstance: NetworkInterceptMiddlewareManager | undefined;

const [registerService, getService] = defineProxy(
  getNetworkInterceptMiddlewareManagerRootService,
  {
    namespace: csProxyServiceName,
    backup: false,
  },
);

export function getNetworkInterceptMiddlewareManagerRootService(): NetworkInterceptMiddlewareManager {
  invariant(
    isInContentScript() && !isMainWorldContext(),
    "This method is only allowed in content script, use getNetworkInterceptMiddlewareManagerProxyService instead.",
  );

  rootServiceInstance ??= NetworkInterceptMiddlewareManagerImpl.getInstance();

  return rootServiceInstance;
}

export function getNetworkInterceptMiddlewareManagerProxyService(): ComctxProxy<NetworkInterceptMiddlewareManager> {
  invariant(
    isMainWorldContext(),
    "Use getNetworkInterceptMiddlewareManagerRootService to access the non-proxied instance in content script.",
  );

  proxyServiceInstance ??= getService(
    getDocumentAdapter(`complexity:${csProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<NetworkInterceptMiddlewareManager>;
}

export function getNetworkInterceptMiddlewareManagerService(): ComctxProxy<NetworkInterceptMiddlewareManager> {
  return isMainWorldContext()
    ? getNetworkInterceptMiddlewareManagerProxyService()
    : (getNetworkInterceptMiddlewareManagerRootService() as any);
}

export default function () {
  registerService(getDocumentAdapter(`complexity:${csProxyServiceName}`));
}
