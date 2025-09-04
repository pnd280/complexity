import { sendMessage } from "webext-bridge/content-script";

import { messageBlocksReactFiberNodePathResourceConfig } from "@/plugins/_core/dom-observers/thread/message-blocks/index.remote-resources";
import type { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { type MessageBlockFiberData } from "@/plugins/_core/main-world/react-vdom/actions/get-messages";
import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";
import { getVersionedRemoteResource } from "@/services/cplx-api/versioned-remote-resources/utils";

const remoteFiberNodePath = (
  await getVersionedRemoteResource(
    messageBlocksReactFiberNodePathResourceConfig,
  )
).split(".");

export async function findMessageBlocks(
  $threadMessagesContainer: JQuery<HTMLElement>,
): Promise<MessageBlock[] | null> {
  if (!$threadMessagesContainer[0]) return null;

  const $messageBlockElements = $threadMessagesContainer.find(
    `>${DomSelectorsService.cachedSync.THREAD.MESSAGE.OUTER_WRAPPER}`,
  );

  if ($messageBlockElements.length === 0) return [];

  const messageBlocksFiberData = await sendMessage(
    "reactVdom:getMessages",
    {
      remoteFiberNodePath: remoteFiberNodePath ?? undefined,
    },
    "window",
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

function processMessageBlock(
  messageBlockFiber: MessageBlockFiberData | undefined,
  $wrapper: JQuery<HTMLElement>,
  index: number,
): MessageBlock | null {
  $wrapper
    .internalComponentAttr(
      DomSelectorsService.internalAttributes.THREAD.MESSAGE.BLOCK,
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
      $query.find(DomSelectorsService.cachedSync.THREAD.MESSAGE.QUERY).text(),
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
  const SELECTORS = DomSelectorsService.cachedSync.THREAD.MESSAGE;

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
    DomSelectorsService.internalAttributes.THREAD.MESSAGE.QUERY,
  );
  $queryEditButtonGroup.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.MESSAGE
      .QUERY_EDIT_BUTTON_GROUP,
  );
  $answer.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.MESSAGE.ANSWER,
  );
  $footer.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.MESSAGE.FOOTER,
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
    $query.find(DomSelectorsService.cachedSync.QUERY_BOX.TEXTBOX.EDIT_QUERY)
      .length > 0;

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
      DomSelectorsService.cachedSync.THREAD.MESSAGE.QUERY_EDIT_BUTTON_GROUP,
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
