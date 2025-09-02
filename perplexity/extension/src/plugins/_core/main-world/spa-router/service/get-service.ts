import type { SpaRouterService } from "@/plugins/_core/main-world/spa-router/service";
import { getSpaRouterProxyService } from "@/plugins/_core/main-world/spa-router/service/proxy";
import { getSpaRouterRootService } from "@/plugins/_core/main-world/spa-router/service/proxy-register";
import type { ComctxProxy } from "@/utils/comctx/types";

export function getSpaRouterService(): ComctxProxy<typeof SpaRouterService> {
  return isMainWorldContext()
    ? (getSpaRouterRootService() as any)
    : getSpaRouterProxyService();
}
