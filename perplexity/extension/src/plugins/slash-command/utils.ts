import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import type { AnchorSlice } from "@/plugins/slash-command/store/slices/anchor";
import { createTextboxAdapter } from "@/plugins/slash-command/textbox-adapter";
import { whereAmI } from "@/utils/utils";

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
      getDomSelectorsRootService().cachedSync.QUERY_BOX.TEXTBOX.EDIT_QUERY,
    )
  )
    return false;

  return Object.entries(
    getDomSelectorsRootService().cachedSync.QUERY_BOX.TEXTBOX,
  ).some(([_, selector]) => target.matches(selector));
}

function isEditQueryBoxTextbox(
  target: HTMLElement,
): target is HTMLTextAreaElement {
  if (!mightBeTextbox(target)) return false;

  return target.matches(
    `${getDomSelectorsRootService().cplxAttribute(
      getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE.QUERY,
    )} ${getDomSelectorsRootService().cachedSync.QUERY_BOX.TEXTBOX.EDIT_QUERY}`,
  );
}

function createAnchorData(
  target: HTMLElement,
  anchorElement: HTMLElement,
  options: Pick<
    NonNullable<AnchorSlice["anchor"]["positioningOptions"]>,
    "placement" | "gutter"
  >,
): {
  element: HTMLElement;
  inputField: HTMLElement;
  positioningOptions: NonNullable<AnchorSlice["anchor"]["positioningOptions"]>;
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
    contentActions: createTextboxAdapter(target),
  };
}

export function getAnchor(
  target: HTMLElement,
): Pick<
  AnchorSlice["anchor"],
  "element" | "inputField" | "positioningOptions" | "contentActions"
> | null {
  if (isQueryBoxTextbox(target)) {
    const anchor = $(target).closest(
      getDomSelectorsRootService().cachedSync.QUERY_BOX.WRAPPER.ARBITRARY,
    )[0];

    if (!anchor) return null;

    const isHomePageTextbox = (
      ["home", "collection"] as ReturnType<typeof whereAmI>[]
    ).includes(whereAmI());

    return createAnchorData(target, anchor, {
      gutter: 5,
      placement: isHomePageTextbox ? "bottom" : "top",
    });
  }

  if (isEditQueryBoxTextbox(target)) {
    return createAnchorData(target, target, {
      gutter: 10,
      placement: "bottom",
    });
  }

  return null;
}
