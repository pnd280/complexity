import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { extensionSettingsQueries } from "@/services/infra/extension-api-wrappers/extension-settings/query-keys";
import { isInContentScript } from "@/utils/misc/utils";

export function useExtensionSettingsMutation() {
  const queryClient = useQueryClient();

  if (isInContentScript())
    throw new Error(
      "Extension settings can not be reactive in content scripts! Use static methods from `ExtensionSettingsService` instead.",
    );

  return useMutation({
    mutationKey: ["updateExtensionSettings"],
    mutationFn: ExtensionSettingsService.set,
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: extensionSettingsQueries.all(),
        exact: true,
      });
    },
  });
}
