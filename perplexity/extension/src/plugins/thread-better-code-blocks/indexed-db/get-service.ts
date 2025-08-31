import type { BetterCodeBlocksFineGrainedService } from "@/plugins/thread-better-code-blocks/indexed-db";
import { getBetterCodeBlocksFineGrainedOptionsProxyService } from "@/plugins/thread-better-code-blocks/indexed-db/proxy";
import { getBetterCodeBlocksFineGrainedOptionsRootService } from "@/plugins/thread-better-code-blocks/indexed-db/proxy-register.bg-worker";
import { isBackgroundScript } from "@/utils/utils";

export function getBetterCodeBlocksFineGrainedOptionsService(): BetterCodeBlocksFineGrainedService {
  return isBackgroundScript()
    ? getBetterCodeBlocksFineGrainedOptionsRootService()
    : getBetterCodeBlocksFineGrainedOptionsProxyService();
}
