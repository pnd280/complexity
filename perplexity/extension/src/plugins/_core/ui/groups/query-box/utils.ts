import { produce } from "immer";

import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { pplxCookiesStore } from "@/plugins/_core/global-stores/pplx-cookies-store";
import type { QueryBoxType } from "@/plugins/_core/ui/groups/query-box/types";
import type {
  LanguageModelCode,
  LanguageModelType,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { setCookie } from "@/utils/dom-utils/generics";

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
    getDomSelectorsRootService().cachedSync.QUERY_BOX.ATTR_WRAPPER,
  );

  $queryBoxComponentsWrapper.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.QUERY_BOX_CHILD
      .COMPONENTS_WRAPPER,
  );

  // --- Left Toolbar ---
  const $pplxLeftToolbarWrapper = $queryBoxComponentsWrapper.find(
    getDomSelectorsRootService().cachedSync.QUERY_BOX.ATTR_WRAPPER_CHILD
      .LEFT_ATTR_WRAPPER,
  );

  $pplxLeftToolbarWrapper.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.QUERY_BOX_CHILD
      .PPLX_LEFT_TOOLBAR_COMPONENTS_WRAPPER,
  );

  const $leftToolbarLeftContainer = findOrCreateContainer({
    $parentElement: $pplxLeftToolbarWrapper,
    internalAttribute:
      getDomSelectorsRootService().internalAttributes.QUERY_BOX_CHILD
        .CPLX_LEFT_TOOLBAR_COMPONENTS_LEFT_WRAPPER,
    position: "prepend",
  });

  const $leftToolbarRightContainer = findOrCreateContainer({
    $parentElement: $pplxLeftToolbarWrapper,
    internalAttribute:
      getDomSelectorsRootService().internalAttributes.QUERY_BOX_CHILD
        .CPLX_LEFT_TOOLBAR_COMPONENTS_RIGHT_WRAPPER,
    position: "append",
  });

  // --- Right Toolbar ---
  const $pplxRightToolbarWrapper = $queryBoxComponentsWrapper.find(
    getDomSelectorsRootService().cachedSync.QUERY_BOX.ATTR_WRAPPER_CHILD
      .RIGHT_ATTR_WRAPPER,
  );

  $pplxRightToolbarWrapper.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.QUERY_BOX_CHILD
      .PPLX_RIGHT_TOOLBAR_COMPONENTS_WRAPPER,
  );

  const $rightToolbarLeftContainer = findOrCreateContainer({
    $parentElement: $pplxRightToolbarWrapper,
    internalAttribute:
      getDomSelectorsRootService().internalAttributes.QUERY_BOX_CHILD
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

  const selector =
    getDomSelectorsRootService().cplxAttribute(internalAttribute);
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

export function getActiveQueryBoxTextbox({
  type,
}: {
  type?: QueryBoxType;
} = {}): JQuery<HTMLTextAreaElement> {
  if (!type)
    return $(
      `${getDomSelectorsRootService().cachedSync.QUERY_BOX.TEXTBOX.ARBITRARY}:last`,
    );

  const selectorMap: Record<QueryBoxType, string> = {
    main: getDomSelectorsRootService().cachedSync.QUERY_BOX.TEXTBOX.MAIN,
    space: getDomSelectorsRootService().cachedSync.QUERY_BOX.TEXTBOX.SPACE,
    "follow-up":
      getDomSelectorsRootService().cachedSync.QUERY_BOX.TEXTBOX.FOLLOW_UP,
    "comet-assistant":
      getDomSelectorsRootService().cachedSync.QUERY_BOX.TEXTBOX.COMET_ASSISTANT,
  };

  return $(selectorMap[type]);
}

export function getActiveQueryBox({ type }: { type?: QueryBoxType } = {}) {
  return getActiveQueryBoxTextbox({
    type,
  })
    .parents(
      getDomSelectorsRootService().cachedSync.QUERY_BOX.WRAPPER.ARBITRARY,
    )
    .first();
}

export function isLexical(textbox: HTMLElement) {
  return (
    textbox.isContentEditable && textbox.hasAttribute("data-lexical-editor")
  );
}

const cookieName = "pplx.search-models-v4";

export function setModelCookie({
  type,
  modelCode,
}: {
  type: LanguageModelType;
  modelCode: LanguageModelCode;
}) {
  const cookie = pplxCookiesStore
    .getState()
    .cookies.find((cookie) => cookie.name === cookieName);

  if (!cookie) {
    setCookie(
      cookieName,
      JSON.stringify({
        ...getDefaultModelCookie(),
        ...{ [type]: modelCode },
      } satisfies Record<LanguageModelType, LanguageModelCode>),
      30,
    );
    return;
  }

  const parsedCookie = JSON.parse(decodeURIComponent(cookie.value)) as Record<
    LanguageModelType,
    LanguageModelCode
  >;

  if (parsedCookie == null) {
    setCookie(
      cookieName,
      JSON.stringify({
        ...getDefaultModelCookie(),
        ...{ [type]: modelCode },
      }),
      30,
    );
    return;
  }

  const newValue = produce(parsedCookie, (draft) => {
    if (draft[type] == null) {
      draft[type] = modelCode;
    } else {
      draft[type] = modelCode;
    }
  });

  pplxCookiesStore.setState({
    cookies: [
      ...pplxCookiesStore.getState().cookies,
      { name: cookieName, value: JSON.stringify(newValue) },
    ],
  });

  setCookie(cookieName, JSON.stringify(newValue), 30);
}

export function getModelCookie({ type }: { type: LanguageModelType }) {
  const cookie = pplxCookiesStore
    .getState()
    .cookies.find((cookie) => cookie.name === cookieName);

  if (!cookie) {
    return null;
  }

  const parsedCookie = JSON.parse(decodeURIComponent(cookie.value)) as Record<
    LanguageModelType,
    LanguageModelCode
  >;

  return (parsedCookie[type] as keyof typeof parsedCookie) ?? null;
}

function getDefaultModelCookie(): Record<LanguageModelType, LanguageModelCode> {
  return {
    search: "pplx_pro",
    research: "pplx_alpha",
    studio: "pplx_beta",
  };
}
