import { queryClient } from "@/data/query-client";
import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { parsePerplexityAskEvent } from "@/plugins/_core/main-world/network-intercept/utils/parse-perplexity-ask-event";
import { getPromptHistoryService } from "@/plugins/prompt-history/indexed-db";
import { promptHistoryQueries } from "@/plugins/prompt-history/indexed-db/query-keys";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:promptHistory:networkInterceptMiddleware": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:queryBox:promptHistory:networkInterceptMiddleware",
    dependencies: ["cache:pluginsStates", "cache:extensionSettings"],
    loader: ({
      "cache:pluginsStates": pluginsStates,
      "cache:extensionSettings": extensionSettings,
    }) => {
      if (
        !pluginsStates["slashCommand"] ||
        !pluginsStates["promptHistory"] ||
        !extensionSettings.plugins["promptHistory"].trigger.onSubmit
      )
        return;

      networkInterceptMiddlewareManager.updateMiddleware({
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

          await getPromptHistoryService().deduplicateAdd({
            prompt: promptString,
          });

          queryClient.invalidateQueries({
            queryKey: promptHistoryQueries.list.all(),
            exact: true,
          });

          return skip();
        },
      });
    },
  });
}
