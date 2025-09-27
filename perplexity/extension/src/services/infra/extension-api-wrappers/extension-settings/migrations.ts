import { produce } from "immer";
import omit from "lodash/omit";

import { APP_CONFIG } from "@/app.config";
import { DEFAULT_EXTENSION_SETTINGS } from "@/services/infra/extension-api-wrappers/extension-settings/defaults";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";
import { errorWrapper } from "@/utils/wrappers/error-wrapper";

export const migrations = {
  2: async () => {
    const [result, error] = await errorWrapper(async () => {
      const oldFlatSchema = await chrome.storage.local.get();

      const newSchema = transfromFlatSchema(oldFlatSchema);
      await chrome.storage.local.clear();

      return newSchema;
    })();

    if (error) {
      if (APP_CONFIG.IS_DEV) {
        console.error("Error migrating v2 schema", error);
      }

      return DEFAULT_EXTENSION_SETTINGS;
    }

    console.log("v2 schema migrated");

    return result;
  },
  3: (oldSettings: ExtensionSettings): ExtensionSettings => {
    const [result, error] = errorWrapper(() => {
      return produce(oldSettings, (draft) => {
        draft.plugins.commandMenu.keybindings.toggle = [
          (oldSettings.plugins.commandMenu as any).hotkey,
        ];
      });
    })();

    if (error) {
      if (APP_CONFIG.IS_DEV) {
        console.error("Error migrating Command Menu keybindings", error);
      }

      return oldSettings;
    }

    console.log("Command Menu keybindings migrated");

    return result;
  },
} satisfies Record<number, (oldSettings: any) => any>;

export function transfromFlatSchema(
  oldFlatSchema: Record<string, any>,
): ExtensionSettings {
  if (oldFlatSchema.plugins == null) {
    return DEFAULT_EXTENSION_SETTINGS;
  }

  const newSchema = {
    ...omit(oldFlatSchema, "settings", "settings$"),
    plugins: {
      ...oldFlatSchema.plugins,
    },
  } as ExtensionSettings;

  return newSchema;
}
