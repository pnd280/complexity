import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache";
import { DomObserversMainWorldActions } from "@/plugins/__core__/dom-observers/_main-world";
import type { MessageBlockFiberData } from "@/plugins/__core__/dom-observers/_main-world/actions/thread-messages";
import { threadMessageBlocksFiberConfigResourceConfig } from "@/plugins/__core__/dom-observers/thread/message-blocks/remote-resources/index.remote-resources";
import { threadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import type { MessageBlock } from "@/plugins/__core__/dom-observers/thread/message-blocks/types";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

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
        name: remoteFiberConfig.name,
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
    $queryEditButtonGroup,
    $answer,
    $footer,
    $displayModelButton,
  } = getComponentNodes({ $wrapper, index });

  const nodes: MessageBlock["nodes"] = {
    $wrapper,
    $query,
    $answer,
    $queryEditButtonGroup,
    $footer,
    $displayModelButton,
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

function isNodeStale($node: JQuery<Element>): boolean {
  return $node[0] == null || !document.contains($node[0]);
}

function refreshStaleNodes(
  existingNodes: MessageBlock["nodes"],
  $wrapper: JQuery<Element>,
) {
  const SELECTORS = DomSelectorsService.Root.cachedSync.THREAD.MESSAGE;
  const nodes = { ...existingNodes };

  if (isNodeStale(nodes.$query)) {
    nodes.$query = $wrapper.find(SELECTORS.QUERY_WRAPPER);
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

  if (isNodeStale(nodes.$displayModelButton)) {
    nodes.$displayModelButton = nodes.$footer.find(
      SELECTORS.FOOTER_CHILD.DISPLAY_MODEL_BUTTON,
    );
  }

  return nodes;
}

function findFreshNodes($wrapper: JQuery<HTMLElement>): MessageBlock["nodes"] {
  const SELECTORS = DomSelectorsService.Root.cachedSync.THREAD.MESSAGE;

  const $elements = $wrapper.find(
    [SELECTORS.QUERY_WRAPPER, SELECTORS.ANSWER, SELECTORS.FOOTER].join(", "),
  );

  const $query = $elements.filter(SELECTORS.QUERY_WRAPPER);
  const $answer = $elements.filter(SELECTORS.ANSWER);
  const $footer = $elements.filter(SELECTORS.FOOTER);
  const $queryEditButtonGroup = $query.find(SELECTORS.QUERY_EDIT_BUTTON_GROUP);
  const $displayModelButton = $footer.find(
    SELECTORS.FOOTER_CHILD.DISPLAY_MODEL_BUTTON,
  );

  return {
    $wrapper,
    $query,
    $answer,
    $footer,
    $queryEditButtonGroup,
    $displayModelButton,
  };
}

function setInternalAttributes(nodes: MessageBlock["nodes"]) {
  const internalAttrs =
    DomSelectorsService.Root.internalAttributes.THREAD.MESSAGE;

  nodes.$query.internalComponentAttr(internalAttrs.QUERY);
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

  const isQueryEditButtonGroupPresent =
    $query.find(
      DomSelectorsService.Root.cachedSync.THREAD.MESSAGE
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
