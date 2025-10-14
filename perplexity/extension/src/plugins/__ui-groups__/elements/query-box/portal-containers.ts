import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

/**
 * @deprecated
 */
export function createToolbarPortalContainers({
  queryBoxWrapper,
}: {
  queryBoxWrapper: HTMLElement;
}): {
  leftToolbar: {
    leftContainer: HTMLElement | null;
    rightContainer: HTMLElement | null;
  };
  rightToolbar: {
    leftContainer: HTMLElement | null;
    rightContainer: HTMLElement | null;
  };
} {
  const $queryBoxComponentsWrapper = $(queryBoxWrapper).find(
    DomSelectorsService.Root.cachedSync.QUERY_BOX.ATTR_WRAPPER,
  );

  $queryBoxComponentsWrapper.internalComponentAttr(
    DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
      .COMPONENTS_WRAPPER,
  );

  // --- Left Toolbar ---
  const $pplxLeftToolbarWrapper = $queryBoxComponentsWrapper.find(
    DomSelectorsService.Root.cachedSync.QUERY_BOX.ATTR_WRAPPER_CHILD
      .LEFT_ATTR_WRAPPER,
  );

  $pplxLeftToolbarWrapper.internalComponentAttr(
    DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
      .PPLX_LEFT_TOOLBAR_COMPONENTS_WRAPPER,
  );

  const $leftToolbarLeftContainer = findOrCreateContainer({
    $parentElement: $pplxLeftToolbarWrapper,
    internalAttribute:
      DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
        .CPLX_LEFT_TOOLBAR_COMPONENTS_LEFT_WRAPPER,
    position: "prepend",
  });

  const $leftToolbarRightContainer = findOrCreateContainer({
    $parentElement: $pplxLeftToolbarWrapper,
    internalAttribute:
      DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
        .CPLX_LEFT_TOOLBAR_COMPONENTS_RIGHT_WRAPPER,
    position: "append",
  });

  // --- Right Toolbar ---
  const $pplxRightToolbarWrapper = $queryBoxComponentsWrapper.find(
    DomSelectorsService.Root.cachedSync.QUERY_BOX.ATTR_WRAPPER_CHILD
      .RIGHT_ATTR_WRAPPER,
  );

  $pplxRightToolbarWrapper.internalComponentAttr(
    DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
      .PPLX_RIGHT_TOOLBAR_COMPONENTS_WRAPPER,
  );

  const $rightToolbarLeftContainer = findOrCreateContainer({
    $parentElement: $pplxRightToolbarWrapper,
    internalAttribute:
      DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
        .CPLX_RIGHT_TOOLBAR_COMPONENTS_LEFT_WRAPPER,
    position: "prepend",
  });

  return {
    leftToolbar: {
      leftContainer: $leftToolbarLeftContainer?.[0] ?? null,
      rightContainer: $leftToolbarRightContainer?.[0] ?? null,
    },
    rightToolbar: {
      leftContainer: $rightToolbarLeftContainer?.[0] ?? null,
      rightContainer: null,
    },
  };
}

function findOrCreateContainer({
  $parentElement,
  internalAttribute,
  position,
}: {
  $parentElement: JQuery<HTMLElement>;
  internalAttribute: string;
  position: "prepend" | "append";
}): JQuery<HTMLElement> | null {
  if (!$parentElement?.length) {
    return null;
  }

  const selector = DomSelectorsService.Root.cplxAttribute(internalAttribute);
  const $existingContainer = $parentElement.find(selector);

  if ($existingContainer.length) {
    return $existingContainer;
  }

  const $newContainer = $("<div>")
    .addClass("x:[&:empty]:hidden x:flex x:items-center x:justify-center")
    .internalComponentAttr(internalAttribute);

  if (position === "prepend") {
    $parentElement.prepend($newContainer);
  } else {
    $parentElement.append($newContainer);
  }

  return $newContainer;
}
