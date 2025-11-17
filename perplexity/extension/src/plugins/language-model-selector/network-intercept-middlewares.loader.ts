import { create } from "mutative";

import { NetworkInterceptMiddlewareManagerService } from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/_service/service-init.loader";
import {
  encodePerplexityAskEvent,
  parsePerplexityAskEvent,
} from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/utils/parse-perplexity-ask-event";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { pluginGuardsStore } from "@/entrypoints/contexts/content-scripts/services/ui-guard/store";
import { settingsStorage as prodDevModeSettingsStorage } from "@/entrypoints/services/features/production-dev-mode/settings";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import { betterLanguageModelSelectorStore } from "@/plugins/language-model-selector/store";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:languageModelSelector:networkInterceptMiddlewares": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:languageModelSelector:networkInterceptMiddlewares",
    dependencies: ["cache:pluginsEnableStatesV2"],
    loader: async ({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) => {
      if (!pluginsEnableStates["queryBox:languageModelSelector"]) return;

      const prodDevMode = await prodDevModeSettingsStorage.getValue();

      let unsub: (() => void) | undefined = undefined; // must do this to prevent strict temporal dead zone on Firefox

      unsub = pluginGuardsStore.subscribe(
        (store) => store.hasActiveSub,
        (hasActiveSub) => {
          if (!hasActiveSub) return;

          unsub?.();

          NetworkInterceptMiddlewareManagerService.Root.updateMiddleware({
            id: "force-change-language-model",
            middlewareFn({ data, skip }) {
              const isWSSend =
                data.type === "networkIntercept:webSocketEvent" &&
                data.event === "send";
              const isSSESend =
                data.type === "networkIntercept:fetchEvent" &&
                data.event === "request";

              if (!isWSSend && !isSSESend) {
                return skip();
              }

              const parsedData = parsePerplexityAskEvent({
                rawData: data.payload.data,
                url: data.payload.url,
              });

              if (parsedData == null) return skip();

              const isRetry = parsedData.params.query_source == "retry";

              const settings = PluginsSettingSnapshotsService.getPluginSnapshot(
                "queryBox:languageModelSelector",
              );

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const newParams = create(parsedData.params, (draft: any) => {
                draft.timezone =
                  prodDevMode.enabled && settings.spoofTimezone
                    ? "America/Los_Angeles"
                    : parsedData.params.timezone;

                if (!isRetry) {
                  const { model: selectedLanguageModel } =
                    betterLanguageModelSelectorStore.getState();
                  draft.model_preference = selectedLanguageModel;
                }
              });

              const newEncodedPayload = encodePerplexityAskEvent({
                newPayload: {
                  ...parsedData,
                  params: newParams,
                },
                url: data.payload.url,
              });

              return newEncodedPayload;
            },
          });
        },
        {
          equalityFn: deepEqual,
          fireImmediately: true,
        },
      );
    },
  });
}
