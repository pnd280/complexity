import { QueryClient } from "@tanstack/react-query";
import { persistQueryClientRestore } from "@tanstack/react-query-persist-client";

import { APP_CONFIG } from "@/app.config";
import {
  persister,
  setQueriesDefaults,
} from "@/services/infra/query-client/utils";

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

export const queryClient = await initNewPersistentQueryClient().catch(
  (error) => {
    console.error("Failed to initialize Query Client:", error);
    return new QueryClient();
  },
);
