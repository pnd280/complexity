import type { MarkmapRendererService } from "@/plugins/_core/main-world/markmap-renderer/service";
import { getMarkmapRendererProxyService } from "@/plugins/_core/main-world/markmap-renderer/service/proxy";
import { getMarkmapRendererRootService } from "@/plugins/_core/main-world/markmap-renderer/service/proxy-register";
import type { ComctxProxy } from "@/utils/comctx/types";

export function getMarkmapRendererService(): ComctxProxy<MarkmapRendererService> {
  return isMainWorldContext()
    ? (getMarkmapRendererRootService() as any)
    : getMarkmapRendererProxyService();
}
