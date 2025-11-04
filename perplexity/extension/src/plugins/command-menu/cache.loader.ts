import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { isSubArray } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:commandMenu:prefetchAndPersist": void;
  }
}

export default async function () {
  AsyncLoaderRegistry.register({
    id: "plugin:commandMenu:prefetchAndPersist",
    dependencies: ["cache:pluginsEnableStates"],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["commandMenu"]) return;

      persistentQueryClient.queryClient.getQueryCache().subscribe((event) => {
        const queryKey = event.query.queryKey;

        if (
          isSubArray(
            pplxApiQueries.threads.infinite.all() as unknown as unknown[],
            queryKey,
          )
        ) {
          if (
            event.type !== "observerResultsUpdated" ||
            event.query.state.status !== "success" ||
            event.query.state.fetchStatus !== "idle"
          ) {
            void persistentQueryClient.persistQueryClient();
          }

          return;
        }

        if (
          isSubArray(
            pplxApiQueries.spaces.detail().queryKey as unknown as unknown[],
            queryKey,
          )
        ) {
          if (
            event.type !== "observerResultsUpdated" ||
            event.query.state.status !== "success" ||
            event.query.state.fetchStatus !== "idle"
          ) {
            void persistentQueryClient.persistQueryClient();
          }

          return;
        }
      });
    },
  });
}
