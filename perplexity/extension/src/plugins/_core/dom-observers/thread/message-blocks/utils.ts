import { getDomSelectorsRootService } from "@/plugins/_core/cache/dom-selectors/service-init.loader";
import { messageBlocksReactFiberNodePathResourceConfig } from "@/plugins/_core/dom-observers/thread/message-blocks/index.remote-resources";
import type { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { type MessageBlockFiberData } from "@/plugins/_core/main-world/react-vdom/actions/get-messages";
import { getReactVdomService } from "@/plugins/_core/main-world/react-vdom/service/service-init";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

const remoteFiberNodePath = (
  await getVersionedRemoteResource(
    messageBlocksReactFiberNodePathResourceConfig,
  )
).split(".");

export async function findMessageBlocks(
  $threadMessagesContainer: JQuery<HTMLElement>,
): Promise<MessageBlock[] | null> {
  if (!$threadMessagesContainer[0]) return null;

  const $messageBlockElements = $threadMessagesContainer.children();

  if ($messageBlockElements.length === 0) return [];

  const messageBlocksFiberData = filterABExperimentalBlocks(
    await getReactVdomService().getMessages(remoteFiberNodePath ?? undefined),
  );

  const nodes = $messageBlockElements.toArray();
  const result: MessageBlock[] = [];

  for (let idx = 0; idx < nodes.length; idx += 1) {
    const messageBlockNode = nodes[idx] as HTMLElement;
    const block = processMessageBlock(
      messageBlocksFiberData?.[idx],
      $(messageBlockNode),
      idx,
    );
    if (block) result.push(block);
  }

  return result;
}

function filterABExperimentalBlocks(
  messageBlocksFiberData: MessageBlockFiberData[] | null,
): MessageBlockFiberData[] | null {
  if (!messageBlocksFiberData || messageBlocksFiberData.length === 0) {
    return messageBlocksFiberData;
  }

  const result: MessageBlockFiberData[] = [];
  let i = 0;
  const len = messageBlocksFiberData.length;

  while (i < len) {
    const currentBlock = messageBlocksFiberData[i];

    if (!currentBlock) {
      i++;
      continue;
    }

    if (!currentBlock.hasVariants) {
      result.push(currentBlock);
      i++;
      continue;
    }

    let selectedVariantInGroup = currentBlock;
    let isSelectedVariantFound = currentBlock.isVariantSelected;
    const currentVariantSiblingId = currentBlock.variantSiblingId;

    i++;
    while (i < len) {
      const nextBlockInGroup = messageBlocksFiberData[i];

      if (
        !nextBlockInGroup ||
        !nextBlockInGroup.hasVariants ||
        nextBlockInGroup.variantSiblingId !== currentVariantSiblingId
      ) {
        break;
      }

      if (!isSelectedVariantFound && nextBlockInGroup.isVariantSelected) {
        selectedVariantInGroup = nextBlockInGroup;
        isSelectedVariantFound = true;
      }

      i++;
    }

    result.push(selectedVariantInGroup);
  }

  return result;
}

function processMessageBlock(
  messageBlockFiber: MessageBlockFiberData | undefined,
  $wrapper: JQuery<HTMLElement>,
  index: number,
): MessageBlock | null {
  if (messageBlockFiber?.hasVariants && !messageBlockFiber.isVariantSelected) {
    return null;
  }

  $wrapper
    .internalComponentAttr(
      getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE.BLOCK,
    )
    .attr("data-index", index);

  const parsedBlock = parseMessageBlock($wrapper);
  const { $query, $queryEditButtonGroup, $sources, $answer, $footer } =
    parsedBlock;

  const nodes: MessageBlock["nodes"] = {
    $wrapper,
    $query,
    $sources,
    $answer,
    $queryEditButtonGroup,
    $footer,
  };

  const content: MessageBlock["content"] = {
    title:
      messageBlockFiber?.title ??
      $query
        .find(getDomSelectorsRootService().cachedSync.THREAD.MESSAGE.QUERY)
        .text(),
    answer: messageBlockFiber?.answer ?? "",
    webResults: messageBlockFiber?.webResults ?? [],
    displayModel: messageBlockFiber?.displayModel ?? "",
    backendUuid: messageBlockFiber?.backendUuid ?? "",
    authorUuid: messageBlockFiber?.authorUuid ?? "",
  };

  const isVirtualized = $answer.length === 0;
  const states = getMessageBlockStates({
    messageBlockNodes: nodes,
    messageBlockFiber,
    isVirtualized,
  });

  return {
    nodes,
    content,
    states: {
      ...states,
      isVirtualized,
    },
  };
}

function parseMessageBlock($messageBlock: JQuery<Element>) {
  const SELECTORS = getDomSelectorsRootService().cachedSync.THREAD.MESSAGE;

  const $elements = $messageBlock.find(
    [
      SELECTORS.QUERY_WRAPPER,
      SELECTORS.SOURCES,
      SELECTORS.ANSWER,
      SELECTORS.FOOTER,
    ].join(", "),
  );

  const $query = $elements.filter(SELECTORS.QUERY_WRAPPER);
  const $sources = $elements.filter(SELECTORS.SOURCES);
  const $answer = $elements.filter(SELECTORS.ANSWER);
  const $footer = $elements.filter(SELECTORS.FOOTER);

  const $queryEditButtonGroup = $query.find(SELECTORS.QUERY_EDIT_BUTTON_GROUP);

  $query.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE.QUERY,
  );
  $queryEditButtonGroup.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE
      .QUERY_EDIT_BUTTON_GROUP,
  );
  $answer.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE.ANSWER,
  );
  $footer.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE.FOOTER,
  );

  return {
    $messageBlock,
    $query,
    $queryEditButtonGroup,
    $sources,
    $answer,
    $footer,
  };
}

function getMessageBlockStates({
  messageBlockNodes,
  messageBlockFiber,
  isVirtualized,
}: {
  messageBlockNodes: MessageBlock["nodes"];
  messageBlockFiber: MessageBlockFiberData | undefined;
  isVirtualized: boolean;
}): Omit<MessageBlock["states"], "isVirtualized"> {
  const { $wrapper, $query, $footer } = messageBlockNodes;

  const isInFlight = isVirtualized
    ? false
    : (messageBlockFiber?.isInFlight ?? $footer[0] == null);

  $wrapper.attr("data-inflight", isInFlight ? "true" : "false");

  const isEditingQuery =
    $query.find(
      getDomSelectorsRootService().cachedSync.QUERY_BOX.TEXTBOX.EDIT_QUERY,
    ).length > 0;

  const existingReadOnlyAttr = $wrapper.attr("data-read-only");
  if (existingReadOnlyAttr != null && existingReadOnlyAttr === "false") {
    return {
      isReadOnly: false,
      isInFlight,
      isEditingQuery,
    };
  }

  const isQueryEditButtonGroupPresent =
    $query.find(
      getDomSelectorsRootService().cachedSync.THREAD.MESSAGE
        .QUERY_EDIT_BUTTON_GROUP,
    ).length > 0;

  $wrapper.attr(
    "data-read-only",
    isQueryEditButtonGroupPresent ? "false" : "true",
  );

  return {
    isReadOnly: !isQueryEditButtonGroupPresent,
    isInFlight,
    isEditingQuery,
  };
}
