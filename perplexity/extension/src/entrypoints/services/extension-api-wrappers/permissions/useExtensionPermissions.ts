import { useQuery, useQueryClient } from "@tanstack/react-query";

import { extensionPermissionsQueries } from "@/entrypoints/services/extension-api-wrappers/permissions/query-keys";
import { revokePermissions } from "@/entrypoints/services/extension-api-wrappers/permissions/utils";
import { useEvent } from "@/hooks/useEvent";

export function useExtensionPermissions() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    extensionPermissionsQueries.permissions.detail(),
  );

  const handleRevokePermission = useEvent(
    async ({
      permissions,
    }: {
      permissions: chrome.runtime.ManifestPermission[];
    }) => {
      try {
        await revokePermissions(permissions);
        void queryClient.invalidateQueries({
          queryKey: extensionPermissionsQueries.permissions.all(),
        });
      } catch (error) {
        alert(`Error revoking permissions: ${error}`);
      }
    },
  );

  return { data, isLoading, handleRevokePermission };
}
