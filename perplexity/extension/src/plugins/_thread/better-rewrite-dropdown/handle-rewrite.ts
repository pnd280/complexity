import { create } from "mutative";

import { NetworkInterceptMiddlewareManagerService } from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/_service/service-init.loader";
import {
  encodePerplexityAskEvent,
  parsePerplexityAskEvent,
} from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/utils/parse-perplexity-ask-event";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import type { LanguageModelCode } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";
import { BetterRewriteDropdownsMainWorldActions } from "@/plugins/_thread/better-rewrite-dropdown/_main-world";
import { threadBetterRewriteDropdownFiberConfigResourceConfig } from "@/plugins/_thread/better-rewrite-dropdown/index.remote-resources";

const remoteFiberConfig = await getVersionedRemoteResource(
  threadBetterRewriteDropdownFiberConfigResourceConfig,
  persistentQueryClient,
);

export const handleRewrite = ({
  selectedModel,
  messageBlockIndex,
  redoSearch,
}: {
  selectedModel: LanguageModelCode;
  messageBlockIndex: number;
  redoSearch: boolean;
}) => {
  NetworkInterceptMiddlewareManagerService.Root.addMiddleware({
    id: "instant-rewrite-model-change",
    middlewareFn({ data, skip }) {
      const isWSSend =
        data.type === "networkIntercept:webSocketEvent" &&
        data.event === "send";
      const isSSESend =
        data.type === "networkIntercept:fetchEvent" && data.event === "request";

      if (!isWSSend && !isSSESend) {
        return skip();
      }

      const parsedData = parsePerplexityAskEvent({
        rawData: data.payload.data,
        url: data.payload.url,
      });

      if (parsedData == null) return skip();

      const isRetry = parsedData.params.query_source == "retry";

      if (!isRetry) return skip();

      NetworkInterceptMiddlewareManagerService.Root.removeMiddleware(
        "instant-rewrite-model-change",
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newParams = create(parsedData.params, (draft: any) => {
        draft.model_preference = selectedModel;
        if (redoSearch) {
          draft.redo_search = true;
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

  setTimeout(() => {
    NetworkInterceptMiddlewareManagerService.Root.removeMiddleware(
      "instant-rewrite-model-change",
    );
  }, 1000);

  void BetterRewriteDropdownsMainWorldActions.Instance.triggerRewriteOption({
    messageBlockIndex,
    fiberConfig: {
      name: remoteFiberConfig.name,
      dataNodePath: remoteFiberConfig.dataNodePath,
    },
  });
};
