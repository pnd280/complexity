import type { NetworkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { getNetworkInterceptMiddlewareManagerProxyService } from "@/plugins/_core/main-world/network-intercept/service/proxy";
import { getNetworkInterceptMiddlewareManagerRootService } from "@/plugins/_core/main-world/network-intercept/service/proxy-register.loader";
import type { ComctxProxy } from "@/utils/comctx-async-proxy";

export function getNetworkInterceptMiddlewareManagerService(): ComctxProxy<NetworkInterceptMiddlewareManager> {
  return isMainWorldContext()
    ? getNetworkInterceptMiddlewareManagerProxyService()
    : (getNetworkInterceptMiddlewareManagerRootService() as any);
}
