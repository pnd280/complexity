import { useThreadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

const OBSERVER_ID = "thread-navbar-attributes-wrapper";

export function useCreatePortalContainer(): HTMLElement | null {
  const $overflowMenuButtonWrapper = useThreadDomObserverStore(
    (state) => state.$overflowMenuButtonWrapper,
    deepEqual,
  );

  if (!$overflowMenuButtonWrapper?.[0]) {
    return null;
  }

  const $wrapper = $($overflowMenuButtonWrapper[0]).parent();

  const $existingPortalContainer = $wrapper.find(
    DomSelectorsService.Root.cplxAttribute(OBSERVER_ID),
  );

  if ($existingPortalContainer[0]) return $existingPortalContainer[0];

  const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

  $wrapper.append($portalContainer);

  return $portalContainer[0] ?? null;
}
