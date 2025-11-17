import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import type {
  PplxAuthSessionApiResponse,
  PplxOrgSettingsApiResponse,
} from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";
import { isSubArray } from "@/utils/misc/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
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
      persistentQueryClient.queryClient.getQueryCache().subscribe((event) => {
        if (
          isSubArray(
            pplxApiQueries.auth.detail().queryKey as unknown as unknown[],
            event.query.queryKey,
          )
        ) {
          if (
            event.type !== "observerResultsUpdated" ||
            event.query.state.status !== "success" ||
            event.query.state.fetchStatus !== "idle"
          ) {
            void persistentQueryClient.persist();
          }
        }
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
