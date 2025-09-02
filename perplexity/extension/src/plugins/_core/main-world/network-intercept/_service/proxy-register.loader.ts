import { defineProxy } from "comctx";

import { getDocumentAdapter } from "@/utils/comctx/get-document-adapter";

import {
  csProxyServiceName,
  NetworkInterceptMiddlewareManager,
} from "@/plugins/_core/main-world/network-intercept/_service";
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

  registerService(getDocumentAdapter(`complexity:${csProxyServiceName}`));
}
