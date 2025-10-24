import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache";
import { NetworkInterceptMiddlewareManagerService } from "@/plugins/__core__/_main-world/network-intercept/_service/service-init.loader";
import { parsePerplexityAskEvent } from "@/plugins/__core__/_main-world/network-intercept/utils/parse-perplexity-ask-event";
import { promptHistoryQueries } from "@/plugins/prompt-history/indexed-db/query-keys";
import { PromptHistoryService } from "@/plugins/prompt-history/indexed-db/service-init.bg-worker";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:promptHistory:networkInterceptMiddleware": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:promptHistory:networkInterceptMiddleware",
    dependencies: ["cache:pluginsEnableStates", "cache:extensionSettings"],
    loader: ({
      "cache:pluginsEnableStates": pluginsEnableStates,
      "cache:extensionSettings": extensionSettings,
    }) => {
      if (
        !pluginsEnableStates["promptHistory"] ||
        !extensionSettings.plugins["promptHistory"].trigger.onSubmit
      )
        return;

      NetworkInterceptMiddlewareManagerService.Root.updateMiddleware({
        id: "submit-prompt-tracker",
        async middlewareFn({ data, skip }) {
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

          const isRewriteMessage = parsedData.params.query_source == "retry";

          if (isRewriteMessage) {
            return skip();
          }

          const promptString = parsedData.query_str;

          if (promptString.length < 1) {
            return skip();
          }

          await PromptHistoryService.Proxy.deduplicateAdd({
            prompt: promptString,
          });

          void persistentQueryClient.queryClient.invalidateQueries({
            queryKey: promptHistoryQueries.list.all(),
            exact: true,
          });

          return skip();
        },
      });
    },
  });
}
