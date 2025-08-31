import type { ReactVdomService } from "@/plugins/_core/main-world/react-vdom/service";
import { getReactVdomProxyService } from "@/plugins/_core/main-world/react-vdom/service/proxy";
import { getReactVdomRootService } from "@/plugins/_core/main-world/react-vdom/service/proxy-register";
import type { ComctxProxy } from "@/utils/comctx-async-proxy";

export function getReactVdomService(): ComctxProxy<typeof ReactVdomService> {
  return isMainWorldContext()
    ? (getReactVdomRootService() as any)
    : getReactVdomProxyService();
}
