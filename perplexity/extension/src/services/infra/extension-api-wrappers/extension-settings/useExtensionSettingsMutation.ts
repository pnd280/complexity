import { useMutation } from "@tanstack/react-query";

import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { extensionSettingsQueries } from "@/services/infra/extension-api-wrappers/extension-settings/query-keys";
import { queryClient } from "@/services/infra/query-client";
import { isInContentScript } from "@/utils/utils";

export function useExtensionSettingsMutation() {
  if (isInContentScript())
    throw new Error(
      "Extension settings can not be reactive in content scripts! Use static methods from `ExtensionSettingsService` instead.",
    );

  return useMutation({
    mutationKey: ["updateExtensionSettings"],
    mutationFn: ExtensionSettingsService.set,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: extensionSettingsQueries.all(),
        exact: true,
      });
    },
  });
}
