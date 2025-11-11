import { useThreadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

const OBSERVER_ID = "query-edit-button-group-wrapper";

export function usePortalContainers(): (Element | null)[] {
  const messageBlocks = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks,
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
      `div${DomSelectorsService.Root.cplxAttribute(OBSERVER_ID)}`,
    );

    if ($existingPortalContainer[0]) return $existingPortalContainer[0];

    const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

    $target.prepend($portalContainer);

    return $portalContainer[0] ?? null;
  });
}
