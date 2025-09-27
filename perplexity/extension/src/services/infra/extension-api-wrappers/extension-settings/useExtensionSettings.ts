import { useQuery } from "@tanstack/react-query";

import { extensionSettingsQueries } from "@/services/infra/extension-api-wrappers/extension-settings/query-keys";
import { useExtensionSettingsMutation } from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettingsMutation";
import { isInContentScript } from "@/utils/misc/utils";

export default function useExtensionSettings() {
  if (isInContentScript())
    throw new Error(
      "Extension settings can not be reactive in content scripts! Use static methods from `ExtensionSettingsService` instead.",
    );

  const data = useQuery(extensionSettingsQueries.detail());
  const mutation = useExtensionSettingsMutation();

  return { settings: data.data, mutation };
}
