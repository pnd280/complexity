import { produce } from "immer";

import { NetworkInterceptMiddlewareManagerService } from "@/plugins/_core/main-world/network-intercept/_service/service-init.loader";
import {
  encodePerplexityAskEvent,
  parsePerplexityAskEvent,
} from "@/plugins/_core/main-world/network-intercept/utils/parse-perplexity-ask-event";
import type { LanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

type ParsedQuery = {
  query: string | null;
  model: LanguageModelCode | null;
  focusModes: string[] | null;
  isIncognito: boolean | null;
};

export function parseQuery(searchParams: URLSearchParams): ParsedQuery | null {
  const query = searchParams.get("q");
  const model = searchParams.get("model");
  const focusModes = searchParams.get("focus")?.split(",") ?? [];
  const isIncognito = searchParams.get("incognito") != null;

  return { query, model, focusModes, isIncognito };
}

export function setupTempInterceptor({
  model,
  focusModes,
  isIncognito,
}: Omit<ParsedQuery, "query">): (() => void) | undefined {
  const interceptorId = "better-search-params";

  if (model == null && focusModes == null && isIncognito == null) {
    return;
  }

  NetworkInterceptMiddlewareManagerService.Root.addMiddleware({
    id: interceptorId,
    middlewareFn({ data, skip, stopPropagation }) {
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

      NetworkInterceptMiddlewareManagerService.Root.removeMiddleware(
        interceptorId,
      );

      const newParams = produce(parsedData.params, (draft: any) => {
        if (model != null) {
          draft.model_preference = model;
        }

        if (isIncognito) {
          draft.is_incognito = true;
        }

        if (focusModes != null && focusModes.length > 0) {
          if (focusModes.includes("writing")) {
            draft.sources = [];
            draft.search_focus = "writing";
          } else {
            draft.sources = focusModes;
          }
        }
      });

      const newEncodedPayload = encodePerplexityAskEvent({
        newPayload: {
          ...parsedData,
          params: newParams,
        },
        url: data.payload.url,
      });

      return stopPropagation(newEncodedPayload);
    },
  });

  return () => {
    NetworkInterceptMiddlewareManagerService.Root.removeMiddleware(
      interceptorId,
    );
  };
}
