import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import {
  pplxAuthOrgStatusQueryObserver,
  pplxAuthQueryObserver,
} from "@/plugins/__async-deps__/plugins-guard/store.loader";
import type {
  PplxAuthSessionApiResponse,
  PplxOrgSettingsApiResponse,
} from "@/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { queryClient } from "@/services/infra/query-client";
import { persistQueryClient } from "@/services/infra/query-client/utils";

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
      pplxAuthQueryObserver.subscribe((data) => {
        if (data.status !== "success" || data.fetchStatus !== "idle") return;

        void persistQueryClient({ queryClient });
      });

      pplxAuthOrgStatusQueryObserver.subscribe((data) => {
        if (data.status !== "success" || data.fetchStatus !== "idle") return;

        void persistQueryClient({ queryClient });
      });

      return {
        authDetail: await queryClient.ensureQueryData(
          pplxApiQueries.auth.detail(),
        ),
        orgDetail: await queryClient.ensureQueryData(
          pplxApiQueries.auth.orgStatus.detail(),
        ),
      };
    },
  });
}
