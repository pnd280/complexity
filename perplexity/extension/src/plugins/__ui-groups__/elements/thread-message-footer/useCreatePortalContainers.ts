import { useThreadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

const OBSERVER_ID = "cplx-thread-message-footer-extra-buttons-wrapper";

export function useCreatePortalContainers(): (Element | null)[] {
  const messageBlocks = useThreadMessageBlocksDomObserverStore(
    (state) => state.messageBlocks,
    deepEqual,
  );

  return (
    messageBlocks?.map((messageBlock) => {
      const $existingPortalContainer = messageBlock.nodes.$footer.find(
        DomSelectorsService.Root.cplxAttribute(OBSERVER_ID),
      );

      if ($existingPortalContainer[0]) return $existingPortalContainer[0];

      const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

      const miscButtonWrapper = messageBlock.nodes.$footer.find(
        DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.FOOTER_CHILD
          .MISC_BUTTON_WRAPPER,
      );

      if (miscButtonWrapper.length) {
        miscButtonWrapper.before($portalContainer);
      } else {
        const copyButtonWrapper = messageBlock.nodes.$footer.find(
          DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.FOOTER_CHILD
            .COPY_BUTTON,
        );

        if (copyButtonWrapper.length) {
          copyButtonWrapper.after($portalContainer);
        }
      }

      return $portalContainer[0] ?? null;
    }) ?? []
  );
}
