/* eslint-disable @typescript-eslint/no-explicit-any */

import { APP_CONFIG } from "@/app.config";
import type { LanguageModelCode } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { DomSelectorsServiceImpl } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import type { PplxWebResult } from "@/entrypoints/services/externals/pplx-api/pplx-thread-parser";
import FiberSearchService from "@/services/features/fiber-search";
import { walkFiberNode } from "@/utils/wrappers/react-fiber";

export type MessageBlockFiberData = {
  backendUuid: string;
  title: string;
  answer: string;
  webResults: PplxWebResult[];
  displayModel: LanguageModelCode;
  userSelectedModel: string;
  isInFlight: boolean;
  authorUuid: string | null;
};

export async function getThreadMessages({
  fiberConfig,
}: {
  fiberConfig: {
    name: string;
    messageNodePath: string[];
  };
}): Promise<MessageBlockFiberData[] | null> {
  const fiberNodes = FiberSearchService.findFiberNodes(
    {
      name: fiberConfig.name,
    },
    {
      rootElementSelector: DomSelectorsServiceImpl.cplxAttribute(
        DomSelectorsServiceImpl.internalAttributes.THREAD
          .MESSAGE_BLOCKS_WRAPPER,
      ),
      findAll: true,
      maxDepth: 100,
      expectSameDepth: true,
      cache: false,
    },
  );

  if (fiberNodes.length === 0) {
    if (APP_CONFIG.IS_DEV) {
      console.error("❌ [ThreadMessages] No fiber nodes found");
    }
  }

  return fiberNodes.map((entryNode: any): MessageBlockFiberData => {
    const entry = JSON.parse(
      JSON.stringify(walkFiberNode(entryNode, fiberConfig.messageNodePath)),
    );

    return {
      title: entry.query_str,
      backendUuid: entry.backend_uuid,
      answer: (entry.blocks as any[])
        .filter((block) => block.intended_usage === "ask_text")
        .map((chunk: any) => chunk.markdown_block.chunks.join(""))
        .join(""),
      webResults: (entry.blocks as any[])
        .filter((block) => block.intended_usage === "web_results")
        .map((chunk: any) =>
          chunk.web_result_block.web_results.map((result: any) => ({
            name: result.name,
            url: result.url,
            snippet: result.snippet,
          })),
        )
        .flat(),

      displayModel: entry.display_model,
      userSelectedModel: entry.user_selected_model,
      isInFlight: entry.status !== "COMPLETED",
      authorUuid: entry.author_id ?? null,
    };
  });
}
