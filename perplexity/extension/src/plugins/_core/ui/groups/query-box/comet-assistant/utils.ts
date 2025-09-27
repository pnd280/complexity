import { DomSelectorsService } from "@/plugins/_core/dom-selectors/service-init.loader";

export function useCreatePortalContainer(wrapper: HTMLElement | null) {
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
