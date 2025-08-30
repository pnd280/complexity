import { useQuery } from "@tanstack/react-query";

import { queryClient } from "@/data/query-client";
import { extensionPermissionsQueries } from "@/services/infra/extension-permissions/query-keys";
import {
  requestPermissions,
  revokePermissions,
} from "@/services/infra/extension-permissions/utils";

export function useExtensionPermissions() {
  const { data, isLoading } = useQuery(
    extensionPermissionsQueries.permissions.detail(),
  );

  const handleGrantPermission = ({
    permissions,
  }: {
    permissions: chrome.runtime.ManifestPermissions[];
  }) => {
    requestPermissions(permissions)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: extensionPermissionsQueries.permissions.all(),
        });
      })
      .catch((error) => {
        alert(`Error granting permissions: ${error}`);
      });
  };

  const handleRevokePermission = ({
    permissions,
  }: {
    permissions: chrome.runtime.ManifestPermissions[];
  }) => {
    revokePermissions(permissions)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: extensionPermissionsQueries.permissions.all(),
        });
      })
      .catch((error) => {
        alert(`Error revoking permissions: ${error}`);
      });
  };

  return { data, isLoading, handleGrantPermission, handleRevokePermission };
}
