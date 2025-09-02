import { produce } from "immer";

import { getNetworkInterceptMiddlewareManagerRootService } from "@/plugins/_core/main-world/network-intercept/_service/proxy-register.loader";
import {
  encodePerplexityAskEvent,
  parsePerplexityAskEvent,
} from "@/plugins/_core/main-world/network-intercept/utils/parse-perplexity-ask-event";
import { getReactVdomService } from "@/plugins/_core/main-world/react-vdom/service/get-service";
import type { LanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export const handleRewrite = ({
  selectedModel,
  messageBlockIndex,
}: {
  selectedModel: LanguageModelCode;
  messageBlockIndex: number;
}) => {
  getNetworkInterceptMiddlewareManagerRootService().addMiddleware({
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

      getNetworkInterceptMiddlewareManagerRootService().removeMiddleware(
        "instant-rewrite-model-change",
      );

      const newParams = produce(parsedData.params, (draft: any) => {
        draft.model_preference = selectedModel;
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
    getNetworkInterceptMiddlewareManagerRootService().removeMiddleware(
      "instant-rewrite-model-change",
    );
  }, 1000);

  getReactVdomService().triggerRewriteOption({
    messageBlockIndex,
    optionIndex: 3,
  });
};
