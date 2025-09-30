import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import type { RouteChangeEventDetail } from "@/plugins/__core__/_main-world/spa-router/spa-router.types";
import { spaRouterStore } from "@/plugins/__core__/_main-world/spa-router/store";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:mainWorld:spaRouter:listeners": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:mainWorld:spaRouter:listeners",
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
