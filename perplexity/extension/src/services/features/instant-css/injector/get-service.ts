import type { InstantCssInjectorService } from "@/services/features/instant-css/injector";
import { getInstantCssInjectorProxyService } from "@/services/features/instant-css/injector/proxy";
import { getInstantCssInjectorRootService } from "@/services/features/instant-css/injector/proxy-register.bg-worker";
import { isBackgroundScript } from "@/utils/utils";

export function getInstantCssInjectorService(): typeof InstantCssInjectorService {
  return isBackgroundScript()
    ? getInstantCssInjectorRootService()
    : getInstantCssInjectorProxyService();
}
