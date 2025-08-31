import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import defineProxy from "comctx";

import {
  backgroundProxyServiceName,
  DeclarativeNetRequestService,
} from "@/services/infra/extension-api-wrappers/declarative-net-request";
import { isBackgroundScript } from "@/utils/utils";

let serviceInstance: typeof DeclarativeNetRequestService | undefined;

export function getDeclarativeNetRequestRootService(): typeof DeclarativeNetRequestService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getDeclarativeNetRequestProxyService instead.",
  );

  serviceInstance ??= DeclarativeNetRequestService;

  return serviceInstance;
}

export default function () {
  const [registerService] = defineProxy(getDeclarativeNetRequestRootService, {
    namespace: backgroundProxyServiceName,
  });

  registerService(new BrowserRuntimeAdapter());
}
