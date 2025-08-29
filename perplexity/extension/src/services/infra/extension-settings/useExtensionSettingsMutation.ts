import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/data/query-client";
import { ExtensionSettingsService } from "@/services/infra/extension-settings";
import { extensionSettingsQueries } from "@/services/infra/extension-settings/query-keys";
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
