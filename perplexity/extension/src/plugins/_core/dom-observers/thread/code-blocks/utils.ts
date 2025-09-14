import { threadCodeBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/code-blocks/store";
import type { CodeBlock } from "@/plugins/_core/dom-observers/thread/code-blocks/types";
import type { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { getReactVdomService } from "@/plugins/_core/main-world/react-vdom/service/service-init";

export function getExistingCodeBlocks(
  messageBlockIndex: number,
): CodeBlock[] | null {
  return (
    threadCodeBlocksDomObserverStore.getState().codeBlocksChunks?.[
      messageBlockIndex
    ] || null
  );
}

export function isNodeStale($node: JQuery<Element> | null): boolean {
  return $node == null || $node[0] == null || !document.contains($node[0]);
}

export function createOrRefreshCodeBlock({
  codeBlockElement,
  codeBlockIndex,
  messageBlocks,
  messageBlockIndex,
  existingCodeBlock,
}: {
  codeBlockElement: Element;
  codeBlockIndex: number;
  messageBlocks: MessageBlock[];
  messageBlockIndex: number;
  existingCodeBlock?: CodeBlock;
}): { nodes: CodeBlock["nodes"]; states: CodeBlock["states"] } {
  const $codeBlock = $(codeBlockElement);

  const nodes =
    existingCodeBlock && !isNodeStale(existingCodeBlock.nodes.$wrapper)
      ? refreshStaleCodeBlockNodes(existingCodeBlock.nodes, $codeBlock)
      : createFreshCodeBlockNodes($codeBlock);

  setCodeBlockAttributes(nodes, codeBlockIndex);

  const states = {
    isInFlight: isCodeBlockInFlight({
      messageBlocks,
      messageBlockIndex,
      codeBlockIndex,
    }),
  };

  return { nodes, states };
}

export function refreshStaleCodeBlockNodes(
  existingNodes: CodeBlock["nodes"],
  $codeBlock: JQuery<Element>,
): CodeBlock["nodes"] {
  const nodes = { ...existingNodes };

  if (isNodeStale(nodes.$wrapper)) {
    nodes.$wrapper = $codeBlock;
  }

  if (isNodeStale(nodes.$nativeCopyButton)) {
    nodes.$nativeCopyButton = $codeBlock.find(
      getDomSelectorsRootService().cachedSync.THREAD.MESSAGE.CODE_BLOCK
        .NATIVE_COPY_BUTTON,
    );
  }

  return nodes;
}

export function createFreshCodeBlockNodes(
  $codeBlock: JQuery<Element>,
): CodeBlock["nodes"] {
  const $nativeCopyButton = $codeBlock.find(
    getDomSelectorsRootService().cachedSync.THREAD.MESSAGE.CODE_BLOCK
      .NATIVE_COPY_BUTTON,
  );

  return {
    $wrapper: $codeBlock,
    $nativeCopyButton,
  };
}

export function setCodeBlockAttributes(
  nodes: CodeBlock["nodes"],
  codeBlockIndex: number,
) {
  nodes.$wrapper
    ?.internalComponentAttr(
      getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE.CODE_BLOCK,
    )
    .attr("data-index", codeBlockIndex);
}

export function getFallbackContent(nodes: CodeBlock["nodes"]): {
  language: string;
  code: string;
} {
  return {
    language:
      nodes.$wrapper?.find(".text-text-200.font-thin:last").text() || "text",
    code: nodes.$wrapper?.find("code:last").text() || "",
  };
}

export async function getCodeBlocksContent(
  messageBlockIndex: number,
  codeBlockIndices: number[],
): Promise<Array<{ language: string; code: string } | null>> {
  if (codeBlockIndices.length === 0) return [];

  const codeBlocks = codeBlockIndices.map((codeBlockIndex) => ({
    messageBlockIndex,
    codeBlockIndex,
  }));

  return await getReactVdomService().getCodeBlocksContent({
    codeBlocks,
  });
}

export function isCodeBlockInFlight({
  messageBlocks,
  messageBlockIndex,
  codeBlockIndex,
}: {
  messageBlocks: MessageBlock[];
  messageBlockIndex: number;
  codeBlockIndex: number;
}) {
  const isMessageBlockInFlight =
    messageBlocks[messageBlockIndex]?.states.isInFlight;

  if (!isMessageBlockInFlight) return false;

  const codeBlock = document.querySelector(
    `${getDomSelectorsRootService().cplxAttribute(
      getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE.BLOCK,
    )}[data-index="${messageBlockIndex}"] ${getDomSelectorsRootService().cplxAttribute(
      getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE.CODE_BLOCK,
    )}[data-index="${codeBlockIndex}"]`,
  );

  const parentElement = codeBlock?.parentElement;

  const hasAnimationWrapper = parentElement?.classList.contains("animate-in");

  if (hasAnimationWrapper) {
    return parentElement?.nextElementSibling == null;
  }

  const hasNextCodeBlock = document.querySelector(
    `${getDomSelectorsRootService().cplxAttribute(
      getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE.BLOCK,
    )}[data-index="${messageBlockIndex}"] ${getDomSelectorsRootService().cplxAttribute(
      getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE.CODE_BLOCK,
    )}[data-index="${codeBlockIndex + 1}"]`,
  );

  if (hasNextCodeBlock) return false;

  return codeBlock?.nextElementSibling == null;
}
