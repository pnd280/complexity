import { getDomSelectorsRootService } from "@/plugins/_core/cache/dom-selectors/service-init.loader";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";

const OBSERVER_ID = "query-edit-button-group-wrapper";

export function useCreatePortalContainers(): (Element | null)[] {
  const messageBlocks = useThreadMessageBlocksDomObserverStore(
    (state) => state.messageBlocks,
    deepEqual,
  );

  if (messageBlocks == null) return [];

  return messageBlocks.map((messageBlock) => {
    if (messageBlock.states.isEditingQuery || messageBlock.states.isInFlight)
      return null;

    const $target = messageBlock.nodes.$queryEditButtonGroup.find(
      '[data-testid="edit-query-button-group"]',
    );

    const $existingPortalContainer = $target.find(
      `div${getDomSelectorsRootService().cplxAttribute(OBSERVER_ID)}`,
    );

    if ($existingPortalContainer[0]) return $existingPortalContainer[0];

    const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

    $target.prepend($portalContainer);

    return $portalContainer[0] ?? null;
  });
}
