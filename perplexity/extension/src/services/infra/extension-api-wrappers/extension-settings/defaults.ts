import { PluginManifestsRegistry } from "@/data/registries/plugins";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";

export const DEFAULT_EXTENSION_SETTINGS: ExtensionSettings = {
  plugins: PluginManifestsRegistry.settingsFallbackValues,
  theme: "complexity",
  energySavingMode: false,
  extensionIconAction: "perplexity",
  devMode: false,
  showPostUpdateReleaseNotesPopup: false,
  isPostUpdateReleaseNotesPopupDismissed: false,
} as const;
