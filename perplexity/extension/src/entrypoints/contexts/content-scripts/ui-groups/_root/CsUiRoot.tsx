import { QueryClientProvider } from "@tanstack/react-query";

import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import Misc from "@/entrypoints/contexts/content-scripts/ui-groups/_root/Misc";
import { createUiGroupRegistry } from "@/entrypoints/utils/ui-registry-factory";

const { registry: csUiRootComponentsRegistry, Components: CsUiRootComponents } =
  createUiGroupRegistry();

export function csUiMount(params: {
  id: string;
  component: React.ReactElement;
}) {
  csUiRootComponentsRegistry.getState().add(params);
}

export default function CsUiRoot() {
  return (
    <QueryClientProvider client={persistentQueryClient.queryClient}>
      <CsUiRootComponents />
      <Misc />
    </QueryClientProvider>
  );
}
