import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache";
import {
  getPplxAuthOrgStatusQueryObserver,
  getPplxAuthQueryObserver,
} from "@/plugins/__async-deps__/plugins-guard/store.loader";
import type {
  PplxAuthSessionApiResponse,
  PplxOrgSettingsApiResponse,
} from "@/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "store:pluginGuards:authApiPrefetch": {
      authDetail: PplxAuthSessionApiResponse;
      orgDetail: PplxOrgSettingsApiResponse;
    };
  }
}

export default async function () {
  AsyncLoaderRegistry.register({
    id: "store:pluginGuards:authApiPrefetch",
    dependencies: [],
    loader: async () => {
      getPplxAuthQueryObserver().subscribe((data) => {
        if (data.status !== "success" || data.fetchStatus !== "idle") return;

        void persistentQueryClient.persistQueryClient();
      });

      getPplxAuthOrgStatusQueryObserver().subscribe((data) => {
        if (data.status !== "success" || data.fetchStatus !== "idle") return;

        void persistentQueryClient.persistQueryClient();
      });

      return {
        authDetail: await persistentQueryClient.queryClient.ensureQueryData(
          pplxApiQueries.auth.detail(),
        ),
        orgDetail: await persistentQueryClient.queryClient.ensureQueryData(
          pplxApiQueries.auth.orgStatus.detail(),
        ),
      };
    },
  });
}
