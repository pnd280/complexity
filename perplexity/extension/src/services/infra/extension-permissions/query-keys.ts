import { queryOptions } from "@tanstack/react-query";

import { getPermissions } from "@/services/infra/extension-permissions/utils";

export const extensionPermissionsQueries = {
  all: () => ["extensionPermissions"] as const,

  permissions: {
    all: () => [...extensionPermissionsQueries.all(), "permissions"] as const,
    detail: () =>
      queryOptions({
        queryKey: [...extensionPermissionsQueries.permissions.all()] as const,
        queryFn: () => getPermissions(),
      }),
  },
};
