import { useSuspenseQuery } from "@tanstack/react-query";

import { extensionSettingsQueries } from "@/services/infra/extension-api-wrappers/extension-settings/query-keys";
import { useExtensionSettingsMutation } from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettingsMutation";
import { isInContentScript } from "@/utils/misc/utils";

export default function useExtensionSettings() {
  invariant(
    !isInContentScript(),
    "Extension settings can not be reactive in content scripts! Use static methods from `ExtensionSettingsService` instead.",
  );

  const data = useSuspenseQuery(extensionSettingsQueries.detail());
  const mutation = useExtensionSettingsMutation();

  return { settings: data.data, mutation };
}
