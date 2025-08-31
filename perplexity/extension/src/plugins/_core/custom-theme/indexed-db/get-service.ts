import type { LocalThemesService } from "@/plugins/_core/custom-theme/indexed-db";
import { getLocalThemesProxyService } from "@/plugins/_core/custom-theme/indexed-db/proxy";
import { getLocalThemesRootService } from "@/plugins/_core/custom-theme/indexed-db/proxy-register.bg-worker";
import { isBackgroundScript } from "@/utils/utils";

export function getLocalThemesService(): LocalThemesService {
  return isBackgroundScript()
    ? getLocalThemesRootService()
    : getLocalThemesProxyService();
}
