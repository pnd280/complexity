import { produce } from "immer";

import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { pluginGuardsStore } from "@/plugins/__async-deps__/plugins-guard/store";
import { NetworkInterceptMiddlewareManagerService } from "@/plugins/__core__/_main-world/network-intercept/_service/service-init.loader";
import {
  encodePerplexityAskEvent,
  parsePerplexityAskEvent,
} from "@/plugins/__core__/_main-world/network-intercept/utils/parse-perplexity-ask-event";
import { betterLanguageModelSelectorStore } from "@/plugins/language-model-selector/store";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "networkIntercept:languageModelSelector": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "networkIntercept:languageModelSelector",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["queryBox:languageModelSelector"]) return;

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

              const settings = ExtensionSettingsService.cachedSync;

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const newParams = produce(parsedData.params, (draft: any) => {
                draft.timezone =
                  settings.devMode &&
                  settings.plugins["queryBox:languageModelSelector"]
                    .changeTimezone
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
