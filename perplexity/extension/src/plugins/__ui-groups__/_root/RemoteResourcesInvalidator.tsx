import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import useCdnRemoteResourcesInvalidator from "@/hooks/useCdnRemoteResourcesInvalidator";
import { initNewPersistentQueryClient } from "@/services/infra/query-client";

const isolatedQueryClient = await initNewPersistentQueryClient().catch(
  (error) => {
    console.error("Failed to initialize Query Client:", error);
    return new QueryClient();
  },
);

export function RemoteResourcesInvalidator() {
  return (
    <QueryClientProvider client={isolatedQueryClient}>
      <Invalidator />
    </QueryClientProvider>
  );
}

function Invalidator() {
  useCdnRemoteResourcesInvalidator();

  return null;
}
