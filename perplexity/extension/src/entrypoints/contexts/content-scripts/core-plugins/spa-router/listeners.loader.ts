import type { RouteChangeEventDetail } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/spa-router.types";
import { spaRouterStore } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/store";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
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
