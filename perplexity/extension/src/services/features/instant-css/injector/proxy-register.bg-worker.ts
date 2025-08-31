import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import defineProxy from "comctx";

import { backgroundProxyServiceName } from "@/services/features/instant-css/injector/constants";
import { InstantCssInjectorService } from "@/services/features/instant-css/injector/index";
import { isBackgroundScript } from "@/utils/utils";

let serviceInstance: typeof InstantCssInjectorService | undefined;

export function getInstantCssInjectorRootService(): typeof InstantCssInjectorService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getInstantCssInjectorProxyService instead.",
  );

  serviceInstance ??= InstantCssInjectorService;

  return serviceInstance;
}

export default function () {
  const [registerService] = defineProxy(getInstantCssInjectorRootService, {
    namespace: backgroundProxyServiceName,
  });

  registerService(new BrowserRuntimeAdapter());
}
