import { create } from "mutative";

import { PluginManifestsRegistry } from "@/__registries__/plugins";
import type { PluginId } from "@/__registries__/plugins/meta.types";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";

export const ESSENTIALS_ONLY: ExtensionSettings["plugins"] = create(
  PluginManifestsRegistry.settingsFallbackValues,
  (draft) => {
    draft["thread:toc"].enabled = true;
    draft["thread:exportThread"].enabled = true;
    draft["thread:betterMessageCopyButtons"].enabled = true;
  },
);

export const POWER_USER: ExtensionSettings["plugins"] = create(
  PluginManifestsRegistry.settingsFallbackValues,
  (draft) => {
    draft["promptHistory"].enabled = true;
    draft["commandMenu"].enabled = true;
    draft["thread:toc"].enabled = true;
    draft["thread:exportThread"].enabled = true;
    draft["thread:betterMessageCopyButtons"].enabled = true;
    draft["thread:dragAndDropFileToUploadInThread"].enabled = true;
    draft["zenMode"].enabled = true;
  },
);

export const ALL_PLUGINS: ExtensionSettings["plugins"] = create(
  PluginManifestsRegistry.settingsFallbackValues,
  (draft) => {
    Object.keys(draft).forEach((key) => {
      const pluginIdKey = key as keyof typeof draft;

      const excludedPlugins: PluginId[] = [
        "queryBox:languageModelSelector",
        "thread:betterRewriteDropdowns",
        "imageGenModelSelector",
        "queryBox:submitOnCtrlEnter",
        "thread:customThreadContainerWidth",
        "queryBox:spacesThreadsForceWritingMode",
        "incognitoByDefault",
        "cloudflareTimeoutAutoReload",
        "betterSidebar",
        "noFocusByDefault",
      ];

      if (excludedPlugins.includes(pluginIdKey)) return;

      draft[pluginIdKey].enabled = true;
    });
  },
);
