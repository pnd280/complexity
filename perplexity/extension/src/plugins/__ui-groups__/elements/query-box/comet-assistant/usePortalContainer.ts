import { useQueryBoxesDomObserverStore } from "@/plugins/__core__/dom-observers/query-boxes/store";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

export function usePortalContainer() {
  "use no memo";

  const wrapper = useQueryBoxesDomObserverStore(
    (store) => store.wrapper.cometAssistant,
  );

  if (!wrapper) return null;

  const $existingPortalContainer = $(
    DomSelectorsService.Root.cplxAttribute(
      DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
        .COMET_ASSISTANT,
    ),
  );

  if ($existingPortalContainer[0]) return $existingPortalContainer[0];

  const $target = $(wrapper).find(
    DomSelectorsService.Root.cachedSync.QUERY_BOX.ATTR_WRAPPER_CHILD
      .COMET_ASSISTANT,
  );

  if (!$target.length) return null;

  const $container = $("<div>").internalComponentAttr(
    DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD.COMET_ASSISTANT,
  );

  $target.prepend($container);

  return $container[0];
}
