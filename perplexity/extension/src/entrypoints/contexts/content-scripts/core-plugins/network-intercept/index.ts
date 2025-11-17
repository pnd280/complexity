import { NetworkInterceptMiddlewareManagerService } from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/_service/service-init.loader";
import { initFetchInterceptor } from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/interceptors/fetch";
import { initBeaconInterceptor } from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/interceptors/navigator-beacon";
import { initWebSocketInterceptor } from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/interceptors/web-socket";
import { initXhrInterceptor } from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/interceptors/xhr";

initFetchInterceptor();
initXhrInterceptor();
initWebSocketInterceptor();
initBeaconInterceptor();

void NetworkInterceptMiddlewareManagerService.Proxy.setOverridesReady(true);
