import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  DeclarativeNetRequestServiceImpl,
  type DeclarativeNetRequestService,
} from "@/services/infra/extension-api-wrappers/declarative-net-request";
import { isBackgroundScript } from "@/utils/utils";

let rootServiceInstance: DeclarativeNetRequestService | undefined;
let proxyServiceInstance: DeclarativeNetRequestService | undefined;

const [registerService, getService] = defineProxy(
  getDeclarativeNetRequestRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

export function getDeclarativeNetRequestRootService(): DeclarativeNetRequestService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getDeclarativeNetRequestProxyService instead.",
  );

  rootServiceInstance ??= DeclarativeNetRequestServiceImpl;

  return rootServiceInstance;
}

export function getDeclarativeNetRequestProxyService(): DeclarativeNetRequestService {
  invariant(
    !isBackgroundScript(),
    "Use getDeclarativeNetRequestRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export function getDeclarativeNetRequestService(): DeclarativeNetRequestService {
  return isBackgroundScript()
    ? getDeclarativeNetRequestRootService()
    : getDeclarativeNetRequestProxyService();
}

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
