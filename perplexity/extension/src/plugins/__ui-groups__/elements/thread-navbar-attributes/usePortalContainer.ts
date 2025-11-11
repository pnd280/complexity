import { useThreadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

const OBSERVER_ID = "thread-navbar-attributes-wrapper";

export function usePortalContainer(): HTMLElement | null {
  "use no memo";

  const $overflowMenuButtonWrapper = useThreadDomObserverStore(
    (store) => store.$overflowMenuButtonWrapper,
    deepEqual,
  );

  if (!$overflowMenuButtonWrapper?.[0]) {
    $(DomSelectorsService.Root.cplxAttribute(OBSERVER_ID)).remove();
    return null;
  }

  const $wrapper = $overflowMenuButtonWrapper.parent();

  const $existingPortalContainer = $wrapper.find(
    DomSelectorsService.Root.cplxAttribute(OBSERVER_ID),
  );

  if ($existingPortalContainer[0]) return $existingPortalContainer[0];

  const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

  $overflowMenuButtonWrapper.after($portalContainer);

  return $portalContainer[0] ?? null;
}
