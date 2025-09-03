import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  DeclarativeNetRequestService,
} from "@/services/infra/extension-api-wrappers/declarative-net-request";
import { isBackgroundScript } from "@/utils/utils";

let rootServiceInstance: typeof DeclarativeNetRequestService | undefined;
let proxyServiceInstance: typeof DeclarativeNetRequestService | undefined;

const [registerService, getService] = defineProxy(
  getDeclarativeNetRequestRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

export function getDeclarativeNetRequestRootService(): typeof DeclarativeNetRequestService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getDeclarativeNetRequestProxyService instead.",
  );

  rootServiceInstance ??= DeclarativeNetRequestService;

  return rootServiceInstance;
}

export function getDeclarativeNetRequestProxyService(): typeof DeclarativeNetRequestService {
  invariant(
    !isBackgroundScript(),
    "Use getDeclarativeNetRequestRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export function getDeclarativeNetRequestService(): typeof DeclarativeNetRequestService {
  return isBackgroundScript()
    ? getDeclarativeNetRequestRootService()
    : getDeclarativeNetRequestProxyService();
}

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
