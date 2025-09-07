import { messageBlocksReactFiberNodePathResourceConfig } from "@/plugins/_core/dom-observers/thread/message-blocks/index.remote-resources";
import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import type { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
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

  const messageBlocksFiberData = await getReactVdomService().getMessages(
    remoteFiberNodePath ?? undefined,
  );

  const nodes = $messageBlockElements.toArray();
  const result: MessageBlock[] = [];

  for (let index = 0; index < nodes.length; index += 1) {
    const messageBlockNode = nodes[index] as HTMLElement;
    const block = parseMessageBlock({
      messageBlockFiber: messageBlocksFiberData?.[index],
      $wrapper: $(messageBlockNode),
      index,
    });
    if (block) result.push(block);
  }

  return result;
}

function parseMessageBlock({
  messageBlockFiber,
  $wrapper,
  index,
}: {
  messageBlockFiber: MessageBlockFiberData | undefined;
  $wrapper: JQuery<HTMLElement>;
  index: number;
}): MessageBlock | null {
  if (messageBlockFiber?.hasVariants && !messageBlockFiber.isVariantSelected) {
    return null;
  }

  $wrapper
    .internalComponentAttr(
      getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE.BLOCK,
    )
    .attr("data-index", index);

  const { $query, $queryEditButtonGroup, $sources, $answer, $footer } =
    getComponentNodes({ $wrapper, index });

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

function getComponentNodes({
  $wrapper,
  index,
}: {
  $wrapper: JQuery<Element>;
  index: number;
}) {
  const SELECTORS = getDomSelectorsRootService().cachedSync.THREAD.MESSAGE;
  const existingNodes = getExistingNodes(index);

  const nodes = existingNodes
    ? refreshStaleNodes(existingNodes, $wrapper, SELECTORS)
    : findFreshNodes($wrapper, SELECTORS);

  setInternalAttributes(nodes);

  return nodes;
}

function getExistingNodes(index: number) {
  return threadMessageBlocksDomObserverStore.getState().messageBlocks?.[index]
    ?.nodes;
}

function isNodeStale($node: JQuery<Element>): boolean {
  return $node[0] == null || !document.contains($node[0]);
}

function refreshStaleNodes(
  existingNodes: MessageBlock["nodes"],
  $wrapper: JQuery<Element>,
  SELECTORS: ReturnType<
    typeof getDomSelectorsRootService
  >["cachedSync"]["THREAD"]["MESSAGE"],
) {
  const nodes = { ...existingNodes };

  if (isNodeStale(nodes.$query)) {
    nodes.$query = $wrapper.find(SELECTORS.QUERY_WRAPPER);
  }

  if (isNodeStale(nodes.$sources)) {
    nodes.$sources = $wrapper.find(SELECTORS.SOURCES);
  }

  if (isNodeStale(nodes.$answer)) {
    nodes.$answer = $wrapper.find(SELECTORS.ANSWER);
  }

  if (isNodeStale(nodes.$footer)) {
    nodes.$footer = $wrapper.find(SELECTORS.FOOTER);
  }

  if (isNodeStale(nodes.$queryEditButtonGroup)) {
    nodes.$queryEditButtonGroup = nodes.$query.find(
      SELECTORS.QUERY_EDIT_BUTTON_GROUP,
    );
  }

  return nodes;
}

function findFreshNodes(
  $wrapper: JQuery<Element>,
  SELECTORS: ReturnType<
    typeof getDomSelectorsRootService
  >["cachedSync"]["THREAD"]["MESSAGE"],
): MessageBlock["nodes"] {
  const $elements = $wrapper.find(
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

  return {
    $wrapper: $wrapper as JQuery<HTMLElement>,
    $query,
    $sources,
    $answer,
    $footer,
    $queryEditButtonGroup,
  };
}

function setInternalAttributes(nodes: MessageBlock["nodes"]) {
  const internalAttrs =
    getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE;

  nodes.$query.internalComponentAttr(internalAttrs.QUERY);
  nodes.$queryEditButtonGroup.internalComponentAttr(
    internalAttrs.QUERY_EDIT_BUTTON_GROUP,
  );
  nodes.$answer.internalComponentAttr(internalAttrs.ANSWER);
  nodes.$footer.internalComponentAttr(internalAttrs.FOOTER);
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
