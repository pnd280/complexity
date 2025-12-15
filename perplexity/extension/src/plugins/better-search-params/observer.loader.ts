import type { RouteObject } from "react-router-dom";

import { NetworkInterceptMiddlewareManagerService } from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/_service/service-init.loader";
import { softNavigate } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import { registerHashRouterRoute } from "@/entrypoints/contexts/content-scripts/services/hash-router/index.loader";
import { PluginsStatesV2Service } from "@/entrypoints/services/externals/cplx-api/plugins-states";
import {
  parseQuery,
  setupTempInterceptor,
} from "@/plugins/better-search-params/utils";
import { waitUntil } from "@/utils/misc/utils";

const betterSearchParamsRouterRoute: RouteObject = {
  path: "",
  loader: async ({ request }) => {
    if (!PluginsStatesV2Service.cachedEnableStates?.betterSearchParams)
      return null;

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const parsedQuery = parseQuery(searchParams);

    if (parsedQuery == null) return null;

    const { query, model, focusModes, spaceId, isIncognito } = parsedQuery;

    if (query == null) return null;

    const cleanup = setupTempInterceptor({
      model,
      focusModes,
      isIncognito,
      spaceId,
    });

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

export default function () {
  registerHashRouterRoute({
    id: "plugin:betterSearchParams:observer",
    route: betterSearchParamsRouterRoute,
  });
}
