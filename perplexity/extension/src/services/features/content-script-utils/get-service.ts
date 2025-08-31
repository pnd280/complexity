import type { ContentScriptBgUtilsService } from "@/services/features/content-script-utils";
import { getContentScriptBgUtilsProxyService } from "@/services/features/content-script-utils/proxy";
import { getContentScriptBgUtilsRootService } from "@/services/features/content-script-utils/proxy-register.bg-worker";
import { isBackgroundScript } from "@/utils/utils";

export function getContentScriptBgUtilsService(): typeof ContentScriptBgUtilsService {
  return isBackgroundScript()
    ? getContentScriptBgUtilsRootService()
    : getContentScriptBgUtilsProxyService();
}
