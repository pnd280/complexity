import { QueryObserver } from "@tanstack/react-query";

import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache/index.lib-loader";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:commandMenu:prefetchAndPersist": void;
  }
}

export default async function () {
  AsyncLoaderRegistry.register({
    id: "plugin:commandMenu:prefetchAndPersist",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["commandMenu"]) return;

      new QueryObserver(persistentQueryClient.queryClient, {
        queryKey: pplxApiQueries.spaces.detail().queryKey,
        enabled: false,
      }).subscribe((data) => {
        if (data.status !== "success" || data.fetchStatus !== "idle") return;

        void persistentQueryClient.persistQueryClient();
      });

      new QueryObserver(persistentQueryClient.queryClient, {
        queryKey: pplxApiQueries.threads.infinite.detail({
          searchValue: "",
          initialPageParam: 0,
        }).queryKey,
        enabled: false,
      }).subscribe((data) => {
        if (data.status !== "success" || data.fetchStatus !== "idle") return;

        void persistentQueryClient.persistQueryClient();
      });

      void persistentQueryClient.queryClient.ensureQueryData(
        pplxApiQueries.spaces.detail(),
      );
      void persistentQueryClient.queryClient.ensureInfiniteQueryData(
        pplxApiQueries.threads.infinite.detail({
          searchValue: "",
          initialPageParam: 0,
        }),
      );
    },
  });
}
