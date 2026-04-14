import { create } from "mutative";

import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import type { PluginsSettings } from "@/entrypoints/services/plugins/settings/types";
import type { PluginId } from "@/entrypoints/services/plugins/types";

const defaults = PluginsSettingSnapshotsService.getPluginsFallbackValues();

export const ESSENTIALS_ONLY: PluginsSettings = create(defaults, (draft) => {
  draft["thread:toc"].enabled = true;
  draft["thread:exportThread"].enabled = true;
  draft["thread:betterMessageCopyButtons"].enabled = true;
});

export const POWER_USER: PluginsSettings = create(defaults, (draft) => {
  draft["promptHistory"].enabled = true;
  draft["commandMenu"].enabled = true;
  draft["thread:toc"].enabled = true;
  draft["thread:exportThread"].enabled = true;
  draft["thread:betterMessageCopyButtons"].enabled = true;
  draft["zenMode"].enabled = true;
});

export const ALL_PLUGINS: PluginsSettings = create(defaults, (draft) => {
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
});
