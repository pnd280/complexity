import React from "react";

import type { PluginId } from "@/data/plugin-registry/types";
import { invariant } from "@/utils/utils";

export type PluginSettingsUIs = Partial<
  Record<
    PluginId,
    {
      component: React.ReactNode;
      openInFullScreen?: boolean;
    }
  >
>;

export const PLUGIN_SETTINGS_UIS: PluginSettingsUIs = (() => {
  const settingsUis: PluginSettingsUIs = {};

  const entries = import.meta.glob("@/plugins/!(_core)/settings-ui.tsx", {
    eager: true,
  }) as Record<
    string,
    {
      default: React.ComponentType;
      pluginId: PluginId;
      openInFullScreen?: boolean;
    }
  >;

  for (const [_, module] of Object.entries(entries)) {
    invariant(
      module.default != null,
      `Plugin settings UI for "${module.pluginId}" is declared but missing default export`,
    );

    invariant(
      module.pluginId != null,
      `Plugin settings UI for "${module.pluginId}" is declared but missing \`pluginId\` export`,
    );

    settingsUis[module.pluginId] = {
      component: React.createElement(module.default),
      openInFullScreen: module.openInFullScreen ?? false,
    };
  }

  return settingsUis;
})();
