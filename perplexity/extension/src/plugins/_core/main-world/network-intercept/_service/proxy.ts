import { defineProxy } from "comctx";

import { getDocumentAdapter } from "@/utils/comctx/get-document-adapter";

import type { NetworkInterceptMiddlewareManager } from "@/plugins/_core/main-world/network-intercept/_service";
import { csProxyServiceName } from "@/plugins/_core/main-world/network-intercept/_service";
import type { ComctxProxy } from "@/utils/comctx/types";

const [, getService] = defineProxy(
  () => ({}) as NetworkInterceptMiddlewareManager,
  {
    namespace: csProxyServiceName,
  },
);

let proxyServiceInstance: NetworkInterceptMiddlewareManager | undefined;

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
