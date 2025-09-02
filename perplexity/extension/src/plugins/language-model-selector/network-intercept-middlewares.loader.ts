import { produce } from "immer";

import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { getNetworkInterceptMiddlewareManagerRootService } from "@/plugins/_core/main-world/network-intercept/_service/proxy-register.loader";
import {
  encodePerplexityAskEvent,
  parsePerplexityAskEvent,
} from "@/plugins/_core/main-world/network-intercept/utils/parse-perplexity-ask-event";
import { pluginGuardsStore } from "@/plugins/_core/plugins-guard/store";
import { sharedQueryBoxStore } from "@/plugins/_core/ui/groups/query-box/shared-store";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "networkIntercept:languageModelSelector": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "networkIntercept:languageModelSelector",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["queryBox:languageModelSelector"]) return;

      let unsub: (() => void) | undefined = undefined; // must do this to prevent strict temporal dead zone on Firefox

      unsub = pluginGuardsStore.subscribe(
        (store) => store.hasActiveSub,
        (hasActiveSub) => {
          if (!hasActiveSub) return;

          unsub?.();

          getNetworkInterceptMiddlewareManagerRootService().updateMiddleware({
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

              const newParams = produce(parsedData.params, (draft: any) => {
                draft.timezone =
                  settings.devMode &&
                  settings.plugins["queryBox:languageModelSelector"]
                    .changeTimezone
                    ? "America/Los_Angeles"
                    : parsedData.params.timezone;

                if (!isRetry) {
                  const { selectedLanguageModel } =
                    sharedQueryBoxStore.getState();
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
