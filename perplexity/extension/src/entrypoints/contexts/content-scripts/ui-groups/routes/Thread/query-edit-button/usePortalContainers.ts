import { useThreadMessageBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";

const OBSERVER_ID = "query-edit-button-group-wrapper";

export function usePortalContainers(): (Element | null)[] {
  const messageBlocks = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks,
    deepEqual,
  );

  if (messageBlocks == null) return [];

  return messageBlocks.map((messageBlock) => {
    if (messageBlock.states.isEditingQuery) return null;

    const $anchor = messageBlock.nodes.$queryEditButtonGroup;

    if (!$anchor[0]) return null;

    const $existingPortalContainer = $anchor.find(
      `div${DomSelectorsService.Root.cplxAttribute(OBSERVER_ID)}`,
    );

    if ($existingPortalContainer[0]) return $existingPortalContainer[0];

    const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

    $anchor.prepend($portalContainer);

    return $portalContainer[0] ?? null;
  });
}
