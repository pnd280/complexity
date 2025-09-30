import type { PplxWebResult } from "@/plugins/__async-deps__/pplx-thread-export";
import { localFiberNodePath } from "@/plugins/__core__/dom-observers/thread/message-blocks/remote-resources/fallback";
import type { LanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { DomSelectorsServiceImpl } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { getReactFiberKey } from "@/utils/dom-utils/generics";
import { errorWrapper } from "@/utils/wrappers/error-wrapper";
import {
  findReactFiberNodeValue,
  walkFiberNode,
} from "@/utils/wrappers/react-fiber";

export type MessageBlockFiberData = {
  backendUuid: string;
  title: string;
  answer: string;
  webResults: PplxWebResult[];
  displayModel: LanguageModelCode;
  isInFlight: boolean;
  authorUuid: string | null;
  hasVariants: boolean;
  isVariantSelected: boolean;
  variantSiblingId: string | null;
};

let $messagesContainer: JQuery<HTMLElement> | null = null;

function getMessagesContainer() {
  if (
    $messagesContainer == null ||
    !document.body.contains($messagesContainer[0] ?? null)
  ) {
    $messagesContainer = $(
      DomSelectorsServiceImpl.cplxAttribute(
        DomSelectorsServiceImpl.internalAttributes.THREAD
          .MESSAGE_BLOCKS_WRAPPER,
      ),
    );
  }

  return $messagesContainer;
}

export async function getThreadMessages({
  remoteFiberNodePath,
}: { remoteFiberNodePath?: string[] } = {}): Promise<
  MessageBlockFiberData[] | null
> {
  const $messagesContainer = getMessagesContainer();

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
        ).map((entryNode) => {
          const entry = entryNode.props.result;

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
            hasVariants: entry.side_by_side_metadata != null,
            isVariantSelected:
              entry.side_by_side_metadata?.selection_status === "SELECTED",
            variantSiblingId: entry.side_by_side_metadata?.sibling_uuid,
          };
        });
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
