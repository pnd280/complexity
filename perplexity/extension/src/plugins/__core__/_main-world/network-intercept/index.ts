import { NetworkInterceptMiddlewareManagerService } from "@/plugins/__core__/_main-world/network-intercept/_service/service-init.loader";
import { initFetchInterceptor } from "@/plugins/__core__/_main-world/network-intercept/interceptors/fetch";
import { initBeaconInterceptor } from "@/plugins/__core__/_main-world/network-intercept/interceptors/navigator-beacon";
import { initWebSocketInterceptor } from "@/plugins/__core__/_main-world/network-intercept/interceptors/web-socket";
import { initXhrInterceptor } from "@/plugins/__core__/_main-world/network-intercept/interceptors/xhr";

initFetchInterceptor();
initXhrInterceptor();
initWebSocketInterceptor();
initBeaconInterceptor();

void NetworkInterceptMiddlewareManagerService.Proxy.setOverridesReady(true);
