import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  QueryCacheServiceImpl,
} from "@/entrypoints/core-plugins/persistent-query-client/indexed-db/service";
import type { Db as QueryCacheServiceType } from "@/services/persistent-query-client/types";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: QueryCacheServiceType | undefined;
let proxyServiceInstance: QueryCacheServiceType | undefined;

const [registerService, getService] = defineProxy(getQueryCacheRootService, {
  namespace: backgroundProxyServiceName,
  backup: false,
  heartbeatCheck: false,
});

function getQueryCacheRootService(): QueryCacheServiceType {
  invariant(isBackgroundScript(), "[QueryCacheService] Invalid context");

  rootServiceInstance ??= new QueryCacheServiceImpl();

  return rootServiceInstance;
}

function getQueryCacheProxyService(): QueryCacheServiceType {
  invariant(!isBackgroundScript(), "[QueryCacheService] Invalid context");

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export const QueryCacheService = {
  get Root() {
    return getQueryCacheRootService();
  },
  get Proxy() {
    return getQueryCacheProxyService();
  },
  get Instance(): QueryCacheServiceType {
    return isBackgroundScript()
      ? getQueryCacheRootService()
      : getQueryCacheProxyService();
  },
};

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
