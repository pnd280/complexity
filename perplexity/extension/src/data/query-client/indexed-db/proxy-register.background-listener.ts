import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import defineProxy from "comctx";

import {
  backgroundProxyServiceName,
  QueryCacheService,
} from "@/data/query-client/indexed-db";
import { isBackgroundScript } from "@/utils/utils";

let serviceInstance: QueryCacheService | undefined;

export function getQueryCacheService(): QueryCacheService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getQueryCacheProxyService instead.",
  );

  serviceInstance ??= new QueryCacheService();

  return serviceInstance;
}

export default function listener() {
  const [registerService] = defineProxy(() => getQueryCacheService(), {
    namespace: backgroundProxyServiceName,
  });

  registerService(new BrowserRuntimeAdapter());
}
