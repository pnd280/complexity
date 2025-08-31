import { queryOptions } from "@tanstack/react-query";

import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

export const extensionSettingsQueries = {
  all: () => ["extensionSettings"] as const,
  detail: () =>
    queryOptions({
      queryKey: [...extensionSettingsQueries.all()] as const,
      queryFn: () => ExtensionSettingsService.get(),
    }),
};
