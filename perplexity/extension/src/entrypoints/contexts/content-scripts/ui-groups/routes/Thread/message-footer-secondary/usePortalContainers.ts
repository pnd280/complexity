import { useThreadMessageBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";

const OBSERVER_ID = "thread-message-footer-secondary-extra-buttons-wrapper";

export function usePortalContainers(): (Element | null)[] {
  const messageBlocks = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks,
    deepEqual,
  );

  if (!messageBlocks) return [];

  return messageBlocks.map((messageBlock) => {
    const $existingPortalContainer = messageBlock.nodes.$footer.find(
      DomSelectorsService.Root.cplxAttribute(OBSERVER_ID),
    );

    if ($existingPortalContainer[0]) return $existingPortalContainer[0];

    const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

    const $anchor = messageBlock.nodes.$footer.find(
      `${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.FOOTER_GROUP.SECOND} ${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.FOOTER_CHILD.THUMBS_UP_BUTTON}`,
    );

    if (!$anchor.length) return null;

    $anchor.before($portalContainer);

    return $portalContainer[0] ?? null;
  });
}
