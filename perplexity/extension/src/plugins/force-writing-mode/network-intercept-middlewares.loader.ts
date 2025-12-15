import { create } from "mutative";

import { NetworkInterceptMiddlewareManagerService } from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/_service/service-init.loader";
import {
  encodePerplexityAskEvent,
  parsePerplexityAskEvent,
} from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/utils/parse-perplexity-ask-event";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { forceWritingModeStore } from "@/plugins/force-writing-mode/store";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:spacesThreadsForceWritingMode": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:spacesThreadsForceWritingMode",
    dependencies: ["cache:pluginsEnableStatesV2"],
    loader: ({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) => {
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

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newParams = create(parsedData.params, (draft: any) => {
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
