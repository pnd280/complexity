import debounce from "lodash/debounce";

import { NetworkInterceptMiddlewareManagerService } from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/_service/service-init.loader";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "networkIntercept:pplxApi:userSettings:invalidation": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "networkIntercept:pplxApi:userSettings:invalidation",
    dependencies: [],
    loader: () => {
      const unsubscribe = persistentQueryClient.queryClient
        .getQueryCache()
        .subscribe(({ query }) => {
          const targetQueryKey = pplxApiQueries.userSettings.all();

          if (
            query.queryKey.length === targetQueryKey.length &&
            (query.queryKey.every(
              (key: string, index: number) => key === targetQueryKey[index],
            ) as boolean)
          ) {
            if (query.getObserversCount() > 0) {
              unsubscribe();
              NetworkInterceptMiddlewareManagerService.Root.addMiddleware({
                id: "invalidate-pplx-user-settings",
                middlewareFn({ data, skip }) {
                  const isSSEResponse =
                    data.type === "networkIntercept:fetchEvent" &&
                    data.event === "response";

                  if (!isSSEResponse) {
                    return skip();
                  }

                  const shouldInvalidateSettings =
                    data.payload.url ===
                      "https://www.perplexity.ai/rest/sse/perplexity_ask" &&
                    data.payload.data === "{}";

                  if (shouldInvalidateSettings) {
                    invalidateSettings();
                  }

                  return skip();
                },
              });
            }
          }
        });
    },
  });
}

const invalidateSettings = debounce(() => {
  setTimeout(() => {
    void persistentQueryClient.queryClient.invalidateQueries({
      queryKey: pplxApiQueries.userSettings.all(),
    });
  }, 3000);
}, 2000);
