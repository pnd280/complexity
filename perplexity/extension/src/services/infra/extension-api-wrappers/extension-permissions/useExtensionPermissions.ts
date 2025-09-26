import { useQuery } from "@tanstack/react-query";

import { useEvent } from "@/hooks/useEvent";
import { extensionPermissionsQueries } from "@/services/infra/extension-api-wrappers/extension-permissions/query-keys";
import {
  requestPermissions,
  revokePermissions,
} from "@/services/infra/extension-api-wrappers/extension-permissions/utils";
import { queryClient } from "@/services/infra/query-client";

export function useExtensionPermissions() {
  const { data, isLoading } = useQuery(
    extensionPermissionsQueries.permissions.detail(),
  );

  const handleGrantPermission = useEvent(
    async ({
      permissions,
    }: {
      permissions: chrome.runtime.ManifestPermissions[];
    }) => {
      try {
        await requestPermissions(permissions);
        queryClient.invalidateQueries({
          queryKey: extensionPermissionsQueries.permissions.all(),
        });
      } catch (error) {
        alert(`Error granting permissions: ${error}`);
      }
    },
  );

  const handleRevokePermission = useEvent(
    async ({
      permissions,
    }: {
      permissions: chrome.runtime.ManifestPermissions[];
    }) => {
      try {
        await revokePermissions(permissions);
        queryClient.invalidateQueries({
          queryKey: extensionPermissionsQueries.permissions.all(),
        });
      } catch (error) {
        alert(`Error revoking permissions: ${error}`);
      }
    },
  );

  return { data, isLoading, handleGrantPermission, handleRevokePermission };
}
