import { DocumentAdapter } from "@comctx-adapters/core";
import defineProxy from "comctx";

import { NetworkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { csProxyServiceName } from "@/plugins/_core/main-world/network-intercept/service";
import { isInContentScript } from "@/utils/utils";

let serviceInstance: NetworkInterceptMiddlewareManager | undefined;

export function getNetworkInterceptMiddlewareManagerRootService(): NetworkInterceptMiddlewareManager {
  invariant(
    isInContentScript() && !isMainWorldContext(),
    "This method is only allowed in content script, use getNetworkInterceptMiddlewareManagerProxyService instead.",
  );

  serviceInstance ??= NetworkInterceptMiddlewareManager.getInstance();

  return serviceInstance;
}

export default function () {
  const [registerService] = defineProxy(
    getNetworkInterceptMiddlewareManagerRootService,
    {
      namespace: csProxyServiceName,
    },
  );

  registerService(new DocumentAdapter(`complexity:${csProxyServiceName}`));
}
