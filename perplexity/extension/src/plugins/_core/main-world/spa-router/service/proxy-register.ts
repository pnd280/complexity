import { getDocumentAdapter } from "@/utils/comctx/get-document-adapter";
import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  SpaRouterService,
} from "@/plugins/_core/main-world/spa-router/service";
import { isInContentScript } from "@/utils/utils";

let serviceInstance: typeof SpaRouterService | undefined;

export function getSpaRouterRootService(): typeof SpaRouterService {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "This method is only allowed in main world, use getSpaRouterProxyService instead.",
  );

  serviceInstance ??= SpaRouterService;

  return serviceInstance;
}

export default function registerProxyService() {
  const [registerService] = defineProxy(getSpaRouterRootService, {
    namespace: mainWorldProxyServiceName,
  });

  registerService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );
}
