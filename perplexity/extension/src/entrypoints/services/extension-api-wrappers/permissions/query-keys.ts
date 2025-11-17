import { queryOptions } from "@tanstack/react-query";

import { getPermissions } from "@/entrypoints/services/extension-api-wrappers/permissions/utils";

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
