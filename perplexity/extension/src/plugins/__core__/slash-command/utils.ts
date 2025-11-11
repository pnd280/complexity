import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import type { AnchorSlice } from "@/plugins/__core__/slash-command/store/slices/anchor";
import { createTextboxAdapter } from "@/plugins/__core__/slash-command/textbox-adapter";
import { whereAmI } from "@/utils/misc/utils";

function mightBeTextbox(target: HTMLElement): boolean {
  return (
    target.tagName.toLowerCase() === "textarea" || target.isContentEditable
  );
}

function isQueryBoxTextbox(
  target: HTMLElement,
): target is HTMLTextAreaElement | (HTMLElement & { isContentEditable: true }) {
  if (!mightBeTextbox(target)) return false;

  if (
    target.matches(
      DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX.EDIT_QUERY,
    )
  )
    return false;

  return Object.entries(
    DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX,
  ).some(([_, selector]) => target.matches(selector));
}

function isEditQueryBoxTextbox(
  target: HTMLElement,
): target is HTMLTextAreaElement {
  if (!mightBeTextbox(target)) return false;

  return target.matches(
    `${DomSelectorsService.Root.cplxAttribute(
      DomSelectorsService.Root.internalAttributes.THREAD.MESSAGE.QUERY,
    )} ${DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX.EDIT_QUERY}`,
  );
}

function createAnchorData(
  target: HTMLElement,
  anchorElement: HTMLElement,
  options: Pick<
    NonNullable<AnchorSlice["positioningOptions"]>,
    "placement" | "gutter"
  >,
  portalContainer: HTMLElement | null,
): {
  element: HTMLElement;
  inputField: HTMLElement;
  positioningOptions: NonNullable<AnchorSlice["positioningOptions"]>;
  portalContainer: HTMLElement | null;
  contentActions: ReturnType<typeof createTextboxAdapter>;
} {
  return {
    element: anchorElement,
    inputField: target,
    positioningOptions: {
      ...options,
      flip: true,
      hideWhenDetached: true,
      getAnchorRect: () => anchorElement.getBoundingClientRect(),
    },
    portalContainer,
    contentActions: createTextboxAdapter(target),
  };
}

export function getAnchor(
  target: HTMLElement,
): Pick<
  AnchorSlice,
  | "element"
  | "inputField"
  | "positioningOptions"
  | "portalContainer"
  | "contentActions"
> | null {
  if (isQueryBoxTextbox(target)) {
    const anchor = $(target).closest(
      DomSelectorsService.Root.cachedSync.QUERY_BOX.WRAPPER.ARBITRARY,
    )[0];

    if (!anchor) return null;

    const isHomePageTextbox = (
      ["home", "collection"] as ReturnType<typeof whereAmI>[]
    ).includes(whereAmI());

    return createAnchorData(
      target,
      anchor,
      {
        gutter: -1,
        placement: isHomePageTextbox ? "bottom" : "top",
      },
      anchor,
    );
  }

  if (isEditQueryBoxTextbox(target)) {
    return createAnchorData(
      target,
      target,
      {
        gutter: 10,
        placement: "bottom",
      },
      null,
    );
  }

  return null;
}
