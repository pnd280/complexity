import useSettingsBase, {
  extensionSettingsQueries,
} from "@/entrypoints/hooks/useSettingsBase";
import type { PluginSettingsService } from "@/entrypoints/services/plugins/settings";
import {
  getPluginSettingsStorage,
  getPluginPublicDependents,
} from "@/entrypoints/services/plugins/utils";
import { isInContentScript } from "@/utils/misc/utils";

export default function usePluginSettings<TValue>(
  settingsStorage: PluginSettingsService<TValue>,
) {
  return useSettingsBase({
    storage: settingsStorage.storageItem,
    validatePatches: (patches) => {
      if (!isInContentScript()) return;

      const modifyEnabled = patches.find(
        (patch) => patch.op === "replace" && patch.path[0] === "enabled",
      );

      invariant(
        modifyEnabled == null,
        `[usePluginSettings] \`${settingsStorage.id}\` Modifying \`enabled\` is not allowed in content script`,
      );
    },
    onSettled: (queryClient) => {
      const dependentPlugins = getPluginPublicDependents(settingsStorage.id);

      for (const dependentPluginId of dependentPlugins) {
        const storage = getPluginSettingsStorage(dependentPluginId).storageItem;

        void queryClient.invalidateQueries({
          queryKey: extensionSettingsQueries.settings.details({
            storage,
            key: storage.key,
          }).queryKey,
        });
      }
    },
  });
}
