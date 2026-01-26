import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";
import { isSubArray } from "@/utils/misc/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
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
            void persistentQueryClient.persist();
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
            void persistentQueryClient.persist();
          }

          return;
        }
      });
    },
  });
}
