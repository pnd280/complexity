import { produce } from "immer";

import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { NetworkInterceptMiddlewareManagerService } from "@/plugins/__core__/_main-world/network-intercept/_service/service-init.loader";
import {
  encodePerplexityAskEvent,
  parsePerplexityAskEvent,
} from "@/plugins/__core__/_main-world/network-intercept/utils/parse-perplexity-ask-event";
import { forceWritingModeStore } from "@/plugins/force-writing-mode/store";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:spacesThreadsForceWritingMode": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:spacesThreadsForceWritingMode",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["queryBox:spacesThreadsForceWritingMode"])
        return;

      NetworkInterceptMiddlewareManagerService.Root.updateMiddleware({
        id: "spaces-threads-force-writing-mode",
        middlewareFn({ data, skip }) {
          const enable =
            forceWritingModeStore.getState().spacesThreadsForceWritingMode;

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
