import type { MermaidRendererService } from "@/plugins/_core/main-world/mermaid-renderer/service";
import { getMermaidRendererProxyService } from "@/plugins/_core/main-world/mermaid-renderer/service/proxy";
import { getMermaidRendererRootService } from "@/plugins/_core/main-world/mermaid-renderer/service/proxy-register";
import type { ComctxProxy } from "@/utils/comctx-async-proxy";

export function getMermaidRendererService(): ComctxProxy<MermaidRendererService> {
  return isMainWorldContext()
    ? (getMermaidRendererRootService() as any)
    : getMermaidRendererProxyService();
}
