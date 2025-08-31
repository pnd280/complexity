import { produce } from "immer";

import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import {
  encodePerplexityAskEvent,
  parsePerplexityAskEvent,
} from "@/plugins/_core/main-world/network-intercept/utils/parse-perplexity-ask-event";
import { sharedQueryBoxStore } from "@/plugins/_core/ui/groups/query-box/shared-store";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:spacesThreadsForceWritingMode": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "plugin:queryBox:spacesThreadsForceWritingMode",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["queryBox:spacesThreadsForceWritingMode"]) return;

      networkInterceptMiddlewareManager.updateMiddleware({
        id: "spaces-threads-force-writing-mode",
        middlewareFn({ data, skip }) {
          const enable =
            sharedQueryBoxStore.getState().spacesThreadsForceWritingMode;

          if (!enable) return skip();

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

          const isCollectionThread =
            parsedData.params.query_source == "collection";

          if (!isCollectionThread) return skip();

          const newParams = produce(parsedData.params, (draft: any) => {
            draft.sources = [];
            draft.search_focus = "writing";
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
  });
}
