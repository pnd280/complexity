import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  type QueryCacheService,
} from "@/data/query-client/indexed-db";
import { isBackgroundScript } from "@/utils/utils";

const [, getService] = defineProxy(() => ({}) as QueryCacheService, {
  namespace: backgroundProxyServiceName,
});

let proxyServiceInstance: QueryCacheService | undefined;

export function getQueryCacheProxyService(): QueryCacheService {
  invariant(
    !isBackgroundScript(),
    "Use getQueryCacheRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}
