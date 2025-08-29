import { QueryClient } from "@tanstack/react-query";
import { persistQueryClientRestore } from "@tanstack/react-query-persist-client";

import { APP_CONFIG } from "@/app.config";
import { persister } from "@/data/query-client/utils";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";

export const softCacheBusterKey = "local:cdnCacheBuster";

export async function initNewPersistentQueryClient() {
  const queryClient = new QueryClient();

  if (chrome.runtime == null) {
    return queryClient;
  }

  setQueriesDefaults(queryClient);

  try {
    await persistQueryClientRestore({
      queryClient,
      persister,
      buster: APP_CONFIG.VERSION,
      maxAge: 1000 * 60 * 60 * 24,
    });
  } catch (error) {
    console.error("Error setting up Query Client persistence:", error);
  }

  return queryClient;
}

function setQueriesDefaults(queryClient: QueryClient) {
  queryClient.setQueryDefaults(cplxApiQueries.all(), {
    gcTime: Infinity,
    staleTime: 1000,
  });

  queryClient.setQueryDefaults(cplxApiQueries.remoteResource.all(), {
    gcTime: Infinity,
    staleTime: 1000 * 60 * 60 * 12,
  });

  queryClient.setQueryDefaults(cplxApiQueries.versionedRemoteResource.all(), {
    gcTime: Infinity,
    staleTime: 1000 * 60 * 60 * 12,
  });

  queryClient.setQueryDefaults(pplxApiQueries.spaces.all(), {
    staleTime: 10000,
  });
}

export const queryClient = await initNewPersistentQueryClient().catch(
  (error) => {
    console.error("Failed to initialize Query Client:", error);
    return new QueryClient();
  },
);
