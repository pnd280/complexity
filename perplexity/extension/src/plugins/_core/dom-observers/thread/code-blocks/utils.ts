import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { sendMessage } from "webext-bridge/content-script";

import type { CodeBlock } from "@/plugins/_core/dom-observers/thread/code-blocks/types";
import type { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";

const astCache = new Map<string, any>();
const mdAstProcessor = unified().use(remarkParse).use(remarkGfm);

export async function findCodeBlocks(
  messageBlocks: MessageBlock[],
): Promise<CodeBlock[][]> {
  const codeBlocksChunksPromises = messageBlocks.map((messageBlock, index) =>
    processCodeBlocksForMessageBlock(messageBlocks, index),
  );

  return Promise.all(codeBlocksChunksPromises);
}

async function processCodeBlocksForMessageBlock(
  messageBlocks: MessageBlock[],
  messageBlockIndex: number,
): Promise<CodeBlock[]> {
  const messageBlock = messageBlocks[messageBlockIndex];

  if (!messageBlock) return [];

  if (messageBlock.states.isVirtualized) {
    return parseCodeBlocksFromString(messageBlock);
  }

  const $codeBlockElements = $(messageBlock.nodes.$answer)
    .find(DomSelectorsService.cachedSync.THREAD.MESSAGE.CODE_BLOCK.WRAPPER)
    .toArray();

  if ($codeBlockElements.length === 0) return [];

  const codeBlocks = $codeBlockElements.map(
    (codeBlockElement, codeBlockIndex) => {
      const $codeBlock = $(codeBlockElement);

      $codeBlock
        .internalComponentAttr(
          DomSelectorsService.internalAttributes.THREAD.MESSAGE.CODE_BLOCK,
        )
        .attr("data-index", codeBlockIndex);

      const $nativeCopyButton = $codeBlock.find(
        DomSelectorsService.cachedSync.THREAD.MESSAGE.CODE_BLOCK
          .NATIVE_COPY_BUTTON,
      );

      return {
        index: codeBlockIndex,
        nodes: {
          $wrapper: $codeBlock,
          $nativeCopyButton,
        },
        states: {
          isInFlight: isCodeBlockInFlight({
            messageBlocks,
            messageBlockIndex,
            codeBlockIndex,
          }),
        },
      };
    },
  );

  const codeBlockContents = await getCodeBlocksContent(
    messageBlockIndex,
    codeBlocks.map((block) => block.index),
  );

  return codeBlocks.map(
    (block, idx) =>
      ({
        nodes: block.nodes,
        content: codeBlockContents[idx] || {
          language:
            block.nodes.$wrapper.find(".text-text-200.font-thin:last").text() ||
            "text",
          code: block.nodes.$wrapper.find("code:last").text() || "",
        },
        states: block.states,
      }) satisfies CodeBlock,
  );
}

function parseCodeBlocksFromString(messageBlock: MessageBlock): CodeBlock[] {
  const content = messageBlock.content.answer;

  let ast = astCache.get(content);
  if (ast == null) {
    ast = mdAstProcessor.parse(content);
    astCache.set(content, ast);
  }

  const codeBlocks: CodeBlock[] = [];

  for (const [index, node] of ast.children.entries()) {
    if (node.type !== "code") continue;

    codeBlocks.push({
      nodes: {
        $wrapper: null,
        $nativeCopyButton: null,
      },
      content: {
        language: node.lang ?? "text",
        code: node.value,
      },
      states: {
        isInFlight:
          messageBlock.states.isInFlight &&
          ast.children[index + 1]?.type == null,
      },
    } satisfies CodeBlock);
  }

  return codeBlocks;
}

async function getCodeBlocksContent(
  messageBlockIndex: number,
  codeBlockIndices: number[],
): Promise<Array<{ language: string; code: string } | null>> {
  if (codeBlockIndices.length === 0) return [];

  const codeBlocks = codeBlockIndices.map((codeBlockIndex) => ({
    messageBlockIndex,
    codeBlockIndex,
  }));

  return sendMessage(
    "reactVdom:getCodeBlocksContent",
    {
      codeBlocks,
    },
    "window",
  );
}

function isCodeBlockInFlight({
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
    `${DomSelectorsService.cplxAttribute(
      DomSelectorsService.internalAttributes.THREAD.MESSAGE.BLOCK,
    )}[data-index="${messageBlockIndex}"] ${DomSelectorsService.cplxAttribute(
      DomSelectorsService.internalAttributes.THREAD.MESSAGE.CODE_BLOCK,
    )}[data-index="${codeBlockIndex}"]`,
  );

  const parentElement = codeBlock?.parentElement;

  const hasAnimationWrapper = parentElement?.classList.contains("animate-in");

  if (hasAnimationWrapper) {
    return parentElement?.nextElementSibling == null;
  }

  const hasNextCodeBlock = document.querySelector(
    `${DomSelectorsService.cplxAttribute(
      DomSelectorsService.internalAttributes.THREAD.MESSAGE.BLOCK,
    )}[data-index="${messageBlockIndex}"] ${DomSelectorsService.cplxAttribute(
      DomSelectorsService.internalAttributes.THREAD.MESSAGE.CODE_BLOCK,
    )}[data-index="${codeBlockIndex + 1}"]`,
  );

  if (hasNextCodeBlock) return false;

  return codeBlock?.nextElementSibling == null;
}
