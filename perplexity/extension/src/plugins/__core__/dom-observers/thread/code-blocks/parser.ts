import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

import { DomSelectorsService } from "@/plugins/__async-deps__/dom-selectors/service-init.loader";
import type { CodeBlock } from "@/plugins/__core__/dom-observers/thread/code-blocks/types";
import {
  createOrRefreshCodeBlock,
  getFallbackContent,
  getCodeBlocksContent,
  getExistingCodeBlocks,
} from "@/plugins/__core__/dom-observers/thread/code-blocks/utils";
import type { MessageBlock } from "@/plugins/__core__/dom-observers/thread/message-blocks/types";

const astCache = new Map<string, any>();
const mdAstProcessor = unified().use(remarkParse).use(remarkGfm);

export async function findCodeBlocks(
  messageBlocks: MessageBlock[],
): Promise<CodeBlock[][]> {
  const codeBlocksChunksPromises = messageBlocks.map((messageBlock, index) =>
    parseCodeBlocks(messageBlocks, index),
  );

  return Promise.all(codeBlocksChunksPromises);
}

async function parseCodeBlocks(
  messageBlocks: MessageBlock[],
  messageBlockIndex: number,
): Promise<CodeBlock[]> {
  const messageBlock = messageBlocks[messageBlockIndex];

  if (!messageBlock) return [];

  if (messageBlock.states.isVirtualized) {
    return parseCodeBlocksFromString(messageBlock);
  }

  const codeBlockElements = messageBlock.nodes.$answer
    .find(DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.CODE_BLOCK.WRAPPER)
    .toArray();

  if (codeBlockElements.length === 0) return [];

  const existingCodeBlocks = getExistingCodeBlocks(messageBlockIndex);
  const codeBlocks = codeBlockElements.map((codeBlockElement, codeBlockIndex) =>
    createOrRefreshCodeBlock({
      codeBlockElement,
      codeBlockIndex,
      messageBlocks,
      messageBlockIndex,
      existingCodeBlock: existingCodeBlocks?.[codeBlockIndex],
    }),
  );

  const codeBlockContents = await getCodeBlocksContent(
    messageBlockIndex,
    codeBlocks.map((_, index) => index),
  );

  return codeBlocks.map((block, idx) => ({
    nodes: block.nodes,
    content: codeBlockContents[idx] || getFallbackContent(block.nodes),
    states: block.states,
  }));
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
