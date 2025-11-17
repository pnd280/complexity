import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  DeclarativeNetRequestServiceImpl,
  type DeclarativeNetRequestService as DeclarativeNetRequestServiceType,
} from "@/services/extension-api-wrappers/declarative-net-request";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: DeclarativeNetRequestServiceType | undefined;
let proxyServiceInstance: DeclarativeNetRequestServiceType | undefined;

const [registerService, getService] = defineProxy(
  getDeclarativeNetRequestRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
    heartbeatCheck: false,
  },
);

function getDeclarativeNetRequestRootService(): DeclarativeNetRequestServiceType {
  invariant(
    isBackgroundScript(),
    "[DeclarativeNetRequestService] Invalid context",
  );

  rootServiceInstance ??= DeclarativeNetRequestServiceImpl;

  return rootServiceInstance;
}

function getDeclarativeNetRequestProxyService(): DeclarativeNetRequestServiceType {
  invariant(
    !isBackgroundScript(),
    "[DeclarativeNetRequestService] Invalid context",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export const DeclarativeNetRequestService = {
  get Root() {
    return getDeclarativeNetRequestRootService();
  },
  get Proxy() {
    return getDeclarativeNetRequestProxyService();
  },
  get Instance() {
    return isBackgroundScript()
      ? getDeclarativeNetRequestRootService()
      : getDeclarativeNetRequestProxyService();
  },
};

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
