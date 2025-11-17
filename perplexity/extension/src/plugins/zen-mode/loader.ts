import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
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
import hotkeys from "@/utils/wrappers/hotkeys-js";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:zenMode": void;
  }
}

export default async function () {
  AsyncLoaderRegistry.register({
    id: "plugin:zenMode",
    dependencies: ["cache:pluginsEnableStates", "cache:extensionSettings"],
    loader: async ({
      "cache:pluginsEnableStates": pluginsEnableStates,
      "cache:extensionSettings": extensionSettings,
    }) => {
      if (!pluginsEnableStates["zenMode"]) return;

      insertCss({
        css: await getVersionedRemoteResource(
          zenModeCssResourceConfig,
          persistentQueryClient,
        ),
        id: "zen-mode",
      });

      if (extensionSettings.plugins["zenMode"].persistent) {
        $(document.body).attr(
          "data-cplx-zen-mode",
          localStorage.getItem("cplx.zen-mode.last-state") ?? "false",
        );
      }

      if (extensionSettings.plugins["zenMode"].alwaysHideRelatedQuestions) {
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

      setupKeybinding();
    },
  });
}

function setupKeybinding() {
  const settings = ExtensionSettingsService.cachedSync;

  hotkeys(keysToString(settings.plugins["zenMode"].hotkey), (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    toggleZenMode();
    commandMenuStore.getState().states.setOpen(false);
  });
}
