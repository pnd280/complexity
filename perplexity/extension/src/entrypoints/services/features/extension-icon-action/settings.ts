import { storage } from "@wxt-dev/storage";

import { getLegacyExtensionSettings } from "@/entrypoints/services/data-migration/legacy/utils";

export const EXTENSION_ICON_ACTIONS = ["dashboard", "perplexity"] as const;

export const EXTENSION_ICON_ACTIONS_LABEL: Record<
  (typeof EXTENSION_ICON_ACTIONS)[number],
  string
> = {
  dashboard: "Open extension's Settings Dashboard",
  perplexity: "Open a new instance of perplexity.ai",
};

export type ExtensionIconAction = (typeof EXTENSION_ICON_ACTIONS)[number];

export const settingsStorage = storage.defineItem<ExtensionIconAction>(
  "local:misc:extensionIconAction",
  {
    init: async () => {
      const legacyExtensionSettings = await getLegacyExtensionSettings();

      if (
        legacyExtensionSettings?.extensionIconAction == null ||
        !(
          legacyExtensionSettings.extensionIconAction in
          EXTENSION_ICON_ACTIONS_LABEL
        )
      ) {
        return "perplexity";
      }

      return legacyExtensionSettings.extensionIconAction as ExtensionIconAction;
    },
    fallback: "perplexity",
  },
);
