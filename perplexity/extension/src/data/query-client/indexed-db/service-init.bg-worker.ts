import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  QueryCacheServiceImpl,
  type QueryCacheService,
} from "@/data/query-client/indexed-db";
import { isBackgroundScript } from "@/utils/utils";

let rootServiceInstance: QueryCacheService | undefined;
let proxyServiceInstance: QueryCacheService | undefined;

const [registerService, getService] = defineProxy(getQueryCacheRootService, {
  namespace: backgroundProxyServiceName,
  backup: false,
});

export function getQueryCacheRootService(): QueryCacheService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getQueryCacheProxyService instead.",
  );

  rootServiceInstance ??= QueryCacheServiceImpl;

  return rootServiceInstance;
}

export function getQueryCacheProxyService(): QueryCacheService {
  invariant(
    !isBackgroundScript(),
    "Use getQueryCacheRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export function getQueryCacheService(): QueryCacheService {
  return isBackgroundScript()
    ? getQueryCacheRootService()
    : getQueryCacheProxyService();
}

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
