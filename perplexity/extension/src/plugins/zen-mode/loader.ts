import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";
import type { PluginsSettings } from "@/entrypoints/services/plugins/settings/types";
import { commandMenuStore } from "@/plugins/command-menu/index.public";
import {
  alwaysHideRelatedQuestionsCssResourceConfig,
  zenModeCssResourceConfig,
} from "@/plugins/zen-mode/index.remote-resources";
import { toggleZenMode } from "@/plugins/zen-mode/utils";
import { insertCss } from "@/utils/dom-utils/generics";
import { keysToString } from "@/utils/misc/utils";
import hotkeys from "@/utils/wrappers/hotkeys-js";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:zenMode": void;
  }
}

export default async function () {
  AsyncLoaderRegistry.register({
    id: "plugin:zenMode",
    dependencies: ["cache:pluginsEnableStates", "cache:pluginSettingSnapshots"],
    loader: async ({
      "cache:pluginsEnableStates": pluginsEnableStates,
      "cache:pluginSettingSnapshots": pluginSettingSnapshots,
    }) => {
      if (!pluginsEnableStates["zenMode"]) return;

      insertCss({
        css: await getVersionedRemoteResource(
          zenModeCssResourceConfig,
          persistentQueryClient,
        ),
        id: "zen-mode",
      });

      if (pluginSettingSnapshots["zenMode"].persistent) {
        $(document.body).attr(
          "data-cplx-zen-mode",
          localStorage.getItem("cplx.zen-mode.last-state") ?? "false",
        );
      }

      if (pluginSettingSnapshots["zenMode"].alwaysHideRelatedQuestions) {
        insertCss({
          css: await getVersionedRemoteResource(
            alwaysHideRelatedQuestionsCssResourceConfig,
            persistentQueryClient,
          ),
          id: "always-hide-related-questions",
        });

        $(document.body).attr(
          "data-cplx-zen-mode-always-hide-related-questions",
          "true",
        );
      }

      setupKeybinding(pluginSettingSnapshots["zenMode"].hotkey);
    },
  });
}

function setupKeybinding(hotkey: PluginsSettings["zenMode"]["hotkey"]) {
  hotkeys(keysToString(hotkey), (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    toggleZenMode();
    commandMenuStore.getState().states.setOpen(false);
  });
}
