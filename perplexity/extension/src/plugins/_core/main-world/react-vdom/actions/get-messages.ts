import { findReactFiberNodeValue } from "@/plugins/_core/main-world/react-vdom/utils";
import type { LanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { DomSelectorsService } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { errorWrapper } from "@/utils/error-wrapper";
import type { PplxWebResult } from "@/utils/thread-export";
import { getReactFiberKey } from "@/utils/utils";

export type MessageBlockFiberData = {
  backendUuid: string;
  title: string;
  answer: string;
  webResults: PplxWebResult[];
  displayModel: LanguageModelCode;
  isInFlight: boolean;
  authorUuid: string | null;
};

export const localFiberNodePath = [
  "return",
  "memoizedState",
  "next",
  "next",
  "memoizedState",
  "current",
  "results",
];

export async function getMessages({
  remoteFiberNodePath,
}: { remoteFiberNodePath?: string[] } = {}): Promise<
  MessageBlockFiberData[] | null
> {
  const $messagesContainer = $(
    DomSelectorsService.cplxAttribute(
      DomSelectorsService.internalAttributes.THREAD.MESSAGE_BLOCKS_WRAPPER,
    ),
  );

  if (!$messagesContainer[0]) return null;

  const fiberNode = ($messagesContainer[0] as any)[
    getReactFiberKey($messagesContainer[0])
  ];

  if (fiberNode == null) return null;

  const [messages, error] = errorWrapper(() => {
    return findReactFiberNodeValue({
      fiberNode,
      condition: (node) => {
        return (
          walkFiberNode(node, remoteFiberNodePath ?? localFiberNodePath) != null
        );
      },
      select: (node): MessageBlockFiberData[] => {
        return (
          walkFiberNode(
            node,
            remoteFiberNodePath ?? localFiberNodePath,
          ) as any[]
        ).map((entry) => ({
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
        }));
      },
    });
  })();

  if (error) {
    console.warn(
      "[VDOM Plugin] getMessages",
      "Ref:",
      $messagesContainer,
      "Error:",
      error,
    );

    return null;
  }

  return messages;
}

function walkFiberNode(fiberNode: any, path: string[]) {
  return path.reduce((acc, key) => acc[key], fiberNode);
}
