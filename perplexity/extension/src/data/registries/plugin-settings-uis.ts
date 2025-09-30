import React from "react";

import type { PluginId } from "@/data/registries/plugins/meta.types";
import { invariant } from "@/utils/misc/utils";

export type PluginSettingsUIs = Partial<
  Record<
    PluginId,
    {
      component: React.ReactNode;
      openInFullScreen?: boolean;
    }
  >
>;

export const PluginSettingsUis: PluginSettingsUIs = (() => {
  const settingsUis: PluginSettingsUIs = {};

  const entries = import.meta.glob(
    ["@/plugins/**/settings-ui.tsx", "@/plugins/**/settings-ui/index.tsx"],
    {
      eager: true,
    },
  ) as Record<
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
