import type { InstantCssStorageService } from "@/services/features/instant-css/storage";
import { getInstantCssStorageProxyService } from "@/services/features/instant-css/storage/proxy";
import { getInstantCssStorageRootService } from "@/services/features/instant-css/storage/proxy-register.bg-worker";
import { isBackgroundScript } from "@/utils/utils";

export function getInstantCssStorageService(): typeof InstantCssStorageService {
  return isBackgroundScript()
    ? getInstantCssStorageRootService()
    : getInstantCssStorageProxyService();
}
