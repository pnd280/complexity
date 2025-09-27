import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { DomSelectorsService } from "@/plugins/_core/dom-selectors/service-init.loader";

const OBSERVER_ID = "cplx-thread-message-footer-extra-buttons-wrapper";

export function useCreatePortalContainers(): (Element | null)[] {
  const messageBlocks = useThreadMessageBlocksDomObserverStore(
    (state) => state.messageBlocks,
    deepEqual,
  );

  if (messageBlocks == null) return [];

  return messageBlocks.map((messageBlock) => {
    const $existingPortalContainer = messageBlock.nodes.$footer.find(
      `div${DomSelectorsService.Root.cplxAttribute(OBSERVER_ID)}`,
    );

    if ($existingPortalContainer[0]) return $existingPortalContainer[0];

    const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

    messageBlock.nodes.$footer
      .find(
        DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.FOOTER_CHILD
          .COPY_BUTTON,
      )
      .before($portalContainer);

    return $portalContainer[0] ?? null;
  });
}
