import type { QueryCacheService } from "@/data/query-client/indexed-db";
import { getQueryCacheProxyService } from "@/data/query-client/indexed-db/proxy";
import { getQueryCacheRootService } from "@/data/query-client/indexed-db/proxy-register.bg-worker";
import { isBackgroundScript } from "@/utils/utils";

export function getQueryCacheService(): QueryCacheService {
  return isBackgroundScript()
    ? getQueryCacheRootService()
    : getQueryCacheProxyService();
}
