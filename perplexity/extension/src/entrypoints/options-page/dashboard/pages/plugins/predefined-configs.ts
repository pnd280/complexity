import { produce } from "immer";

import { PluginRegistry } from "@/data/plugin-registry/index";
import type { PluginId } from "@/data/plugin-registry/types";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";

export const ESSENTIALS_ONLY: ExtensionSettings["plugins"] = produce(
  PluginRegistry.fallbackValues,
  (draft) => {
    draft["thread:toc"].enabled = true;
    draft["thread:exportThread"].enabled = true;
    draft["thread:betterMessageCopyButtons"].enabled = true;
  },
);

export const POWER_USER: ExtensionSettings["plugins"] = produce(
  PluginRegistry.fallbackValues,
  (draft) => {
    draft["slashCommand"].enabled = true;
    draft["promptHistory"].enabled = true;
    draft["commandMenu"].enabled = true;
    draft["thread:toc"].enabled = true;
    draft["thread:exportThread"].enabled = true;
    draft["thread:betterMessageCopyButtons"].enabled = true;
    draft["thread:dragAndDropFileToUploadInThread"].enabled = true;
    draft["zenMode"].enabled = true;
  },
);

export const ALL_PLUGINS: ExtensionSettings["plugins"] = produce(
  PluginRegistry.fallbackValues,
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
      ];

      if (excludedPlugins.includes(pluginIdKey)) return;

      draft[pluginIdKey].enabled = true;
    });
  },
);
