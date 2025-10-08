import type { RouteObject } from "react-router-dom";

import { PluginsStatesService } from "@/plugins/__async-deps__/plugins-states";
import { NetworkInterceptMiddlewareManagerService } from "@/plugins/__core__/_main-world/network-intercept/_service/service-init.loader";
import { softNavigate } from "@/plugins/__core__/_main-world/spa-router/utils";
import {
  parseQuery,
  setupTempInterceptor,
} from "@/plugins/better-search-params/utils";
import { waitUntil } from "@/utils/misc/utils";

const betterSearchParamsRouterRoute: RouteObject = {
  path: "",
  loader: async ({ request }) => {
    if (!PluginsStatesService.cachedEnableStates?.betterSearchParams)
      return null;

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const parsedQuery = parseQuery(searchParams);

    if (parsedQuery == null) return null;

    const { query, model, focusModes, isIncognito } = parsedQuery;

    if (query == null) return null;

    const cleanup = setupTempInterceptor({ model, focusModes, isIncognito });
    await Promise.all([
      waitUntil({
        condition: async () => {
          return NetworkInterceptMiddlewareManagerService.Root.overridesReady;
        },
        timeout: 10000,
        interval: 500,
      }),
      waitUntil({
        condition: async () => {
          const url = new URL("/search", window.location.href);

          url.searchParams.set("q", query);

          void softNavigate(url.toString());

          return true;
        },
        timeout: 10000,
        interval: 500,
      }),
    ]);

    setTimeout(() => {
      cleanup?.();
    }, 1000);

    return null;
  },
  element: null,
};

export default betterSearchParamsRouterRoute;
