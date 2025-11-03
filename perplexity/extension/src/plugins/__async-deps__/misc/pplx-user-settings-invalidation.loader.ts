import debounce from "lodash/debounce";

import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { NetworkInterceptMiddlewareManagerService } from "@/plugins/__core__/_main-world/network-intercept/_service/service-init.loader";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";

declare module "@/plugins/__async-deps__/async-loaders" {
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
