import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import type { RouteChangeEventDetail } from "@/plugins/_core/main-world/spa-router/spa-router.types";
import { spaRouterStore } from "@/plugins/_core/main-world/spa-router/store";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "messaging:spaRouter": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "messaging:spaRouter",
    dependencies: [],
    loader: () => {
      setupSpaRouterDispatchListeners();
    },
  });
}

export const spaRouterRouteChangeEvent = "spaRouter:route-change";

function setupSpaRouterDispatchListeners() {
  window.addEventListener(spaRouterRouteChangeEvent, (event) => {
    const detail = (event as CustomEvent<RouteChangeEventDetail>).detail;

    spaRouterStore.setState({
      state: detail.state,
      url: detail.newUrl,
      trigger: detail.trigger,
    });
  });
}
