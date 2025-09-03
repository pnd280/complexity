import { getNetworkInterceptMiddlewareManagerProxyService } from "@/plugins/_core/main-world/network-intercept/_service/service-init.loader";
import { initFetchInterceptor } from "@/plugins/_core/main-world/network-intercept/interceptors/fetch";
import { initBeaconInterceptor } from "@/plugins/_core/main-world/network-intercept/interceptors/navigator-beacon";
import { initWebSocketInterceptor } from "@/plugins/_core/main-world/network-intercept/interceptors/web-socket";
import { initXhrInterceptor } from "@/plugins/_core/main-world/network-intercept/interceptors/xhr";

declare module "@/plugins/_core/main-world/types" {
  interface MainWorldCorePluginRegistry {
    networkIntercept: void;
  }
}

onlyMainWorldGuard();

initFetchInterceptor();
initXhrInterceptor();
initWebSocketInterceptor();
initBeaconInterceptor();

getNetworkInterceptMiddlewareManagerProxyService().setOverridesReady(false);
