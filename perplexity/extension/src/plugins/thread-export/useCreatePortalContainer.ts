import { useThreadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";

export default function useObserver() {
  const $overflowMenuButtonWrapper = useThreadDomObserverStore(
    (state) => state.$overflowMenuButtonWrapper,
    deepEqual,
  );

  return useMemo(() => {
    if ($overflowMenuButtonWrapper == null || !$overflowMenuButtonWrapper[0]) {
      $(
        getDomSelectorsRootService().cplxAttribute(
          getDomSelectorsRootService().internalAttributes.THREAD.NAVBAR_CHILD
            .EXPORT_THREAD_BUTTON,
        ),
      ).remove();

      return null;
    }

    const $wrapper = $($overflowMenuButtonWrapper[0]).parent();

    const $existingPortalContainer = $wrapper.find(
      getDomSelectorsRootService().cplxAttribute(
        getDomSelectorsRootService().internalAttributes.THREAD.NAVBAR_CHILD
          .EXPORT_THREAD_BUTTON,
      ),
    );

    if ($existingPortalContainer.length) return $existingPortalContainer[0];

    const $portalContainer = $("<div>").internalComponentAttr(
      getDomSelectorsRootService().internalAttributes.THREAD.NAVBAR_CHILD
        .EXPORT_THREAD_BUTTON,
    );

    $wrapper.append($portalContainer);

    return $portalContainer[0];
  }, [$overflowMenuButtonWrapper]);
}
