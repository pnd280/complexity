import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { commandMenuStore } from "@/plugins/command-menu/index.public";
import {
  alwaysHideRelatedQuestionsCssResourceConfig,
  zenModeCssResourceConfig,
} from "@/plugins/zen-mode/index.remote-resources";
import { toggleZenMode } from "@/plugins/zen-mode/utils";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { insertCss } from "@/utils/dom-utils/generics";
import { keysToString } from "@/utils/misc/utils";
import hotkeysJs from "@/utils/wrappers/hotkeys-js";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:zenMode": void;
  }
}

export default async function () {
  asyncLoaderRegistry.register({
    id: "plugin:zenMode",
    dependencies: ["cache:pluginsStates", "cache:extensionSettings"],
    loader: async ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["commandMenu"] || !pluginsStates["zenMode"]) return;

      insertCss({
        css: await getVersionedRemoteResource(zenModeCssResourceConfig),
        id: "zen-mode",
      });

      const settings = ExtensionSettingsService.cachedSync;

      if (settings?.plugins["zenMode"].persistent) {
        $(document.body).attr(
          "data-cplx-zen-mode",
          settings?.plugins["zenMode"].lastState.toString() ?? "false",
        );
      }

      if (settings?.plugins["zenMode"].alwaysHideRelatedQuestions) {
        insertCss({
          css: await getVersionedRemoteResource(
            alwaysHideRelatedQuestionsCssResourceConfig,
          ),
          id: "always-hide-related-questions",
        });

        $(document.body).attr(
          "data-cplx-zen-mode-always-hide-related-questions",
          "true",
        );
      }

      setupKeybinding();
    },
  });
}

function setupKeybinding() {
  const settings = ExtensionSettingsService.cachedSync;

  hotkeysJs(keysToString(settings.plugins["zenMode"].hotkey), (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    toggleZenMode();
    commandMenuStore.getState().setOpen(false);
  });
}
