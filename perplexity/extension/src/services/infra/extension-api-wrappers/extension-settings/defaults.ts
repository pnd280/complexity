import { PluginRegistry } from "@/data/plugin-registry/index";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";

export const DEFAULT_EXTENSION_SETTINGS: ExtensionSettings = {
  plugins: PluginRegistry.fallbackValues,
  theme: "complexity",
  energySavingMode: false,
  extensionIconAction: "perplexity",
  devMode: false,
  showPostUpdateReleaseNotesPopup: false,
  isPostUpdateReleaseNotesPopupDismissed: false,
} as const;
