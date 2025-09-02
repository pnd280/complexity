import type { NetworkInterceptMiddlewareManager } from "@/plugins/_core/main-world/network-intercept/_service";
import { getNetworkInterceptMiddlewareManagerProxyService } from "@/plugins/_core/main-world/network-intercept/_service/proxy";
import { getNetworkInterceptMiddlewareManagerRootService } from "@/plugins/_core/main-world/network-intercept/_service/proxy-register.loader";
import type { ComctxProxy } from "@/utils/comctx-async-proxy";

export function getNetworkInterceptMiddlewareManagerService(): ComctxProxy<NetworkInterceptMiddlewareManager> {
  return isMainWorldContext()
    ? getNetworkInterceptMiddlewareManagerProxyService()
    : (getNetworkInterceptMiddlewareManagerRootService() as any);
}
