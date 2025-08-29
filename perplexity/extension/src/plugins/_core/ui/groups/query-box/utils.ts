import { sharedQueryBoxStore } from "@/plugins/_core/ui/groups/query-box/shared-store";
import type { QueryBoxType } from "@/plugins/_core/ui/groups/query-box/types";
import { isLanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/predicates";
import { DomSelectorsService } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";

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
    DomSelectorsService.cachedSync.QUERY_BOX.ATTR_WRAPPER,
  );

  $queryBoxComponentsWrapper.internalComponentAttr(
    DomSelectorsService.internalAttributes.QUERY_BOX_CHILD.COMPONENTS_WRAPPER,
  );

  // --- Left Toolbar ---
  const $pplxLeftToolbarWrapper = $queryBoxComponentsWrapper.find(
    DomSelectorsService.cachedSync.QUERY_BOX.ATTR_WRAPPER_CHILD
      .LEFT_ATTR_WRAPPER,
  );

  $pplxLeftToolbarWrapper.internalComponentAttr(
    DomSelectorsService.internalAttributes.QUERY_BOX_CHILD
      .PPLX_LEFT_TOOLBAR_COMPONENTS_WRAPPER,
  );

  const $leftToolbarLeftContainer = findOrCreateContainer({
    $parentElement: $pplxLeftToolbarWrapper,
    internalAttribute:
      DomSelectorsService.internalAttributes.QUERY_BOX_CHILD
        .CPLX_LEFT_TOOLBAR_COMPONENTS_LEFT_WRAPPER,
    position: "prepend",
  });

  const $leftToolbarRightContainer = findOrCreateContainer({
    $parentElement: $pplxLeftToolbarWrapper,
    internalAttribute:
      DomSelectorsService.internalAttributes.QUERY_BOX_CHILD
        .CPLX_LEFT_TOOLBAR_COMPONENTS_RIGHT_WRAPPER,
    position: "append",
  });

  // --- Right Toolbar ---
  const $pplxRightToolbarWrapper = $queryBoxComponentsWrapper.find(
    DomSelectorsService.cachedSync.QUERY_BOX.ATTR_WRAPPER_CHILD
      .RIGHT_ATTR_WRAPPER,
  );

  $pplxRightToolbarWrapper.internalComponentAttr(
    DomSelectorsService.internalAttributes.QUERY_BOX_CHILD
      .PPLX_RIGHT_TOOLBAR_COMPONENTS_WRAPPER,
  );

  const $rightToolbarLeftContainer = findOrCreateContainer({
    $parentElement: $pplxRightToolbarWrapper,
    internalAttribute:
      DomSelectorsService.internalAttributes.QUERY_BOX_CHILD
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

  const selector = DomSelectorsService.cplxAttribute(internalAttribute);
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

export function populateDefaults() {
  const selectedLanguageModel = localStorage.getItem("cplx.selected-model");

  if (!selectedLanguageModel || !isLanguageModelCode(selectedLanguageModel)) {
    return;
  }

  sharedQueryBoxStore
    .getState()
    .setSelectedLanguageModel(selectedLanguageModel);
}

export function getActiveQueryBoxTextbox({
  type,
}: {
  type?: QueryBoxType;
} = {}): JQuery<HTMLTextAreaElement> {
  if (!type)
    return $(
      `${DomSelectorsService.cachedSync.QUERY_BOX.TEXTBOX.ARBITRARY}:last`,
    );

  const selectorMap: Record<QueryBoxType, string> = {
    main: DomSelectorsService.cachedSync.QUERY_BOX.TEXTBOX.MAIN,
    space: DomSelectorsService.cachedSync.QUERY_BOX.TEXTBOX.SPACE,
    "follow-up": DomSelectorsService.cachedSync.QUERY_BOX.TEXTBOX.FOLLOW_UP,
  };

  return $(selectorMap[type]);
}

export function getActiveQueryBox({ type }: { type?: QueryBoxType } = {}) {
  return getActiveQueryBoxTextbox({
    type,
  })
    .parents(DomSelectorsService.cachedSync.QUERY_BOX.WRAPPER.ARBITRARY)
    .first();
}

export function isLexical(textbox: HTMLElement) {
  return (
    textbox.isContentEditable && textbox.hasAttribute("data-lexical-editor")
  );
}
