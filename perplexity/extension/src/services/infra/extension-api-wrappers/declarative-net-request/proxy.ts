import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  type DeclarativeNetRequestService,
} from "@/services/infra/extension-api-wrappers/declarative-net-request";
import { isBackgroundScript } from "@/utils/utils";

const [, getService] = defineProxy(
  () => ({}) as typeof DeclarativeNetRequestService,
  {
    namespace: backgroundProxyServiceName,
  },
);

let proxyServiceInstance: typeof DeclarativeNetRequestService | undefined;

export function getDeclarativeNetRequestProxyService(): typeof DeclarativeNetRequestService {
  invariant(
    !isBackgroundScript(),
    "Use getDeclarativeNetRequestRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}
