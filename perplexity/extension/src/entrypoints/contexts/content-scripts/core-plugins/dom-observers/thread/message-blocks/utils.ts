import { DomObserversMainWorldActions } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/_main-world";
import type { MessageBlockFiberData } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/_main-world/actions/thread-messages";
import { threadMessageBlocksFiberConfigResourceConfig } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/remote-resources/index.remote-resources";
import { threadMessageBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import type { MessageBlock } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/types";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";
import { viewportStore } from "@/hooks/useViewport";

const remoteFiberConfig = await getVersionedRemoteResource(
  threadMessageBlocksFiberConfigResourceConfig,
  persistentQueryClient,
);

export async function findMessageBlocks(
  $threadMessagesContainer: JQuery<HTMLElement>,
): Promise<MessageBlock[] | null> {
  if (!$threadMessagesContainer[0]) return null;

  const $messageBlockElements = $threadMessagesContainer.children();

  if ($messageBlockElements.length === 0) return [];

  const messageBlocksFiberData =
    await DomObserversMainWorldActions.Instance.getThreadMessages({
      fiberConfig: {
        messageNodePath: remoteFiberConfig.messageNodePath,
      },
    });

  const nodes = $messageBlockElements.toArray();
  const result: MessageBlock[] = [];

  for (let index = 0; index < nodes.length; index += 1) {
    result.push(
      parseMessageBlock({
        messageBlockFiberData: messageBlocksFiberData?.[index],
        $wrapper: $(nodes[index] as HTMLElement),
        index,
      }),
    );
  }

  return result;
}

function parseMessageBlock({
  messageBlockFiberData,
  $wrapper,
  index,
}: {
  messageBlockFiberData: MessageBlockFiberData | undefined;
  $wrapper: JQuery<HTMLElement>;
  index: number;
}): MessageBlock {
  $wrapper
    .internalComponentAttr(
      DomSelectorsService.Root.internalAttributes.THREAD.MESSAGE.BLOCK,
    )
    .attr("data-index", index);

  const {
    $query,
    $queryEditTextBox,
    $queryEditButtonGroup,
    $contentWrapper,
    $answer,
    $footer,
  } = getComponentNodes({ $wrapper, index });

  const nodes: MessageBlock["nodes"] = {
    $wrapper,
    $query,
    $queryEditTextBox,
    $contentWrapper,
    $answer,
    $queryEditButtonGroup,
    $footer,
  };

  const content: MessageBlock["content"] = {
    title:
      messageBlockFiberData?.title ??
      $query
        .find(DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.QUERY)
        .text(),
    answer: messageBlockFiberData?.answer ?? "",
    webResults: messageBlockFiberData?.webResults ?? [],
    displayModel: messageBlockFiberData?.displayModel ?? "",
    backendUuid: messageBlockFiberData?.backendUuid ?? "",
    userSelectedModel: messageBlockFiberData?.userSelectedModel ?? null,
    authorUuid: messageBlockFiberData?.authorUuid ?? "",
  };

  const isVirtualized = $query.length === 0;
  const states = getMessageBlockStates({
    messageBlockNodes: nodes,
    messageBlockFiberData,
  });

  return {
    windowSize: viewportStore.getState().windowWidth,
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
  const existingNodes =
    threadMessageBlocksDomObserverStore.getState().messageBlocks?.[index]
      ?.nodes;

  const nodes = existingNodes
    ? refreshStaleNodes(existingNodes, $wrapper)
    : findFreshNodes($wrapper as JQuery<HTMLElement>);

  setInternalAttributes(nodes);

  return nodes;
}

function isNodeStale({
  $wrapper,
  $node,
}: {
  $wrapper: JQuery<Element>;
  $node: JQuery<Element>;
}): boolean {
  return (
    $wrapper[0] != null || $node[0] == null || !$wrapper[0]!.contains($node[0])
  );
}

function refreshStaleNodes(
  existingNodes: MessageBlock["nodes"],
  $wrapper: JQuery<Element>,
) {
  const SELECTORS = DomSelectorsService.Root.cachedSync.THREAD.MESSAGE;
  const nodes = { ...existingNodes };

  if (isNodeStale({ $wrapper, $node: nodes.$query })) {
    nodes.$query = $wrapper.find(SELECTORS.QUERY_WRAPPER);
  }

  if (isNodeStale({ $wrapper, $node: nodes.$queryEditTextBox })) {
    nodes.$queryEditTextBox = $wrapper.find(SELECTORS.QUERY_EDIT_TEXTBOX);
  }

  if (isNodeStale({ $wrapper, $node: nodes.$contentWrapper })) {
    nodes.$contentWrapper = $wrapper.find(SELECTORS.CONTENT_WRAPPER);
  }

  if (isNodeStale({ $wrapper, $node: nodes.$answer })) {
    nodes.$answer = $wrapper.find(SELECTORS.ANSWER);
  }

  if (isNodeStale({ $wrapper, $node: nodes.$footer })) {
    nodes.$footer = $wrapper.find(SELECTORS.FOOTER);
  }

  if (isNodeStale({ $wrapper, $node: nodes.$queryEditButtonGroup })) {
    nodes.$queryEditButtonGroup = nodes.$query.find(
      SELECTORS.QUERY_EDIT_BUTTON_GROUP,
    );
  }

  return nodes;
}

function findFreshNodes($wrapper: JQuery<HTMLElement>): MessageBlock["nodes"] {
  const SELECTORS = DomSelectorsService.Root.cachedSync.THREAD.MESSAGE;

  const $elements = $wrapper.find(
    [
      SELECTORS.QUERY_WRAPPER,
      SELECTORS.QUERY_EDIT_TEXTBOX,
      SELECTORS.CONTENT_WRAPPER,
      SELECTORS.ANSWER,
      SELECTORS.FOOTER,
    ].join(", "),
  );

  const $query = $elements.filter(SELECTORS.QUERY_WRAPPER);
  const $queryEditTextBox = $elements.filter(SELECTORS.QUERY_EDIT_TEXTBOX);
  const $answer = $elements.filter(SELECTORS.ANSWER);
  const $footer = $elements.filter(SELECTORS.FOOTER);
  const $contentWrapper = $elements.filter(SELECTORS.CONTENT_WRAPPER);

  const $queryEditButtonGroup = $query.find(SELECTORS.QUERY_EDIT_BUTTON_GROUP);

  return {
    $wrapper,
    $query,
    $queryEditTextBox,
    $contentWrapper,
    $answer,
    $footer,
    $queryEditButtonGroup,
  };
}

function setInternalAttributes(nodes: MessageBlock["nodes"]) {
  const internalAttrs =
    DomSelectorsService.Root.internalAttributes.THREAD.MESSAGE;

  nodes.$query.internalComponentAttr(internalAttrs.QUERY);
  nodes.$queryEditTextBox.internalComponentAttr(
    internalAttrs.QUERY_EDIT_TEXTBOX,
  );
  nodes.$queryEditButtonGroup.internalComponentAttr(
    internalAttrs.QUERY_EDIT_BUTTON_GROUP,
  );
  nodes.$answer.internalComponentAttr(internalAttrs.ANSWER);
  nodes.$footer.internalComponentAttr(internalAttrs.FOOTER);
}

function getMessageBlockStates({
  messageBlockNodes,
  messageBlockFiberData,
}: {
  messageBlockNodes: MessageBlock["nodes"];
  messageBlockFiberData: MessageBlockFiberData | undefined;
}): Omit<MessageBlock["states"], "isVirtualized"> {
  const { $wrapper, $query, $footer } = messageBlockNodes;

  const isInFlight = messageBlockFiberData?.isInFlight ?? $footer[0] == null;

  $wrapper.attr("data-inflight", isInFlight ? "true" : "false");

  const isEditingQuery =
    $query.find(
      DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX.EDIT_QUERY,
    ).length > 0;

  const existingReadOnlyAttr = $wrapper.attr("data-read-only");
  if (existingReadOnlyAttr != null && existingReadOnlyAttr === "false") {
    return {
      isReadOnly: false,
      isInFlight,
      isEditingQuery,
    };
  }

  const isRewriteBtnPresent =
    $footer.find(
      DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.FOOTER_CHILD
        .REWRITE_BUTTON_WRAPPER,
    ).length > 0;

  $wrapper.attr("data-read-only", isRewriteBtnPresent ? "false" : "true");

  return {
    isReadOnly: !isRewriteBtnPresent,
    isInFlight,
    isEditingQuery,
  };
}
