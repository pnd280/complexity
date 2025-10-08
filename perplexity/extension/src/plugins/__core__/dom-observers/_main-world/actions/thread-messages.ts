/* eslint-disable @typescript-eslint/no-explicit-any */

import FiberSearchService from "@/plugins/__core__/_main-world/fiber-search";
import type { PplxWebResult } from "@/plugins/__core__/pplx-thread-export";
import type { LanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { DomSelectorsServiceImpl } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { walkFiberNode } from "@/utils/wrappers/react-fiber";

export type MessageBlockFiberData = {
  backendUuid: string;
  title: string;
  answer: string;
  webResults: PplxWebResult[];
  displayModel: LanguageModelCode;
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
  return FiberSearchService.findFiberNodes(
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
  ).map((entryNode: any): MessageBlockFiberData => {
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
      isInFlight: entry.status !== "COMPLETED",
      authorUuid: entry.author_id ?? null,
    };
  });
}
