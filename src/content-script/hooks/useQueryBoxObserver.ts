import $ from "jquery";
import { Dispatch, SetStateAction, useEffect } from "react";

import useRouter from "@/content-script/hooks/useRouter";
import CplxUserSettings from "@/lib/CplxUserSettings";
import { cn } from "@/utils/cn";
import DomObserver from "@/utils/DomObserver/DomObserver";
import UiUtils from "@/utils/UiUtils";
import { queueMicrotasks, whereAmI } from "@/utils/utils";

type UseQueryBoxObserverProps = {
  setContainers: (container: HTMLElement) => void;
  setFollowUpContainers: (container: HTMLElement) => void;
  setImageGenPopoverContainer: Dispatch<
    SetStateAction<HTMLElement | undefined>
  >;
  refetchUserSettings: () => void;
};

export default function useQueryBoxObserver({
  setContainers,
  setFollowUpContainers,
  setImageGenPopoverContainer,
  refetchUserSettings,
}: UseQueryBoxObserverProps) {
  const location = whereAmI(useRouter().url);

  useEffect(
    function mainQueryBoxObserver() {
      const mainId = "main-query-box-selectors";
      const followUpId = "follow-up-query-box-selectors";
      const imageGenerationPopoverId = "image-generation-popover-selectors";
      const alterAttachButtonId = "alter-attach-button";

      DomObserver.create(mainId, {
        target: document.body,
        config: { childList: true, subtree: true },
        source: "hook",
        onAny: () => {
          queueMicrotasks(
            () =>
              observeMainQueryBox({
                id: mainId,
                setContainers,
                refetchUserSettings,
              }),
            () =>
              observeFollowUpQueryBox({
                id: followUpId,
                location,
                setFollowUpContainers,
                refetchUserSettings,
              }),
            () =>
              observeImageGenerationPopover({
                id: imageGenerationPopoverId,
                location,
                setImageGenPopoverContainer,
              }),
            alterAttachButton,
            interceptPasteEvent,
          );
        },
      });

      return () => {
        DomObserver.destroy(mainId);
        DomObserver.destroy(followUpId);
        DomObserver.destroy(alterAttachButtonId);
      };
    },
    [
      location,
      refetchUserSettings,
      setContainers,
      setFollowUpContainers,
      setImageGenPopoverContainer,
    ],
  );
}

function observeMainQueryBox({
  id,
  setContainers,
  refetchUserSettings,
}: {
  id: string;
  setContainers: (containers: HTMLElement) => void;
  refetchUserSettings: () => void;
}) {
  const $buttonBar = UiUtils.getActiveQueryBoxTextarea({ type: "main" })
    .parent()
    .next();

  if (!$buttonBar.length || $buttonBar.attr(`data-${id}`)) return;

  $buttonBar.attr(`data-${id}`, "true");

  $buttonBar.addClass(() =>
    cn("tw-col-span-3 tw-col-start-1 !tw-col-end-4 tw-flex-wrap tw-gap-y-1", {
      "tw-mr-[7rem]":
        !CplxUserSettings.get().popupSettings.queryBoxSelectors.focus,
      "tw-mr-10": CplxUserSettings.get().popupSettings.queryBoxSelectors.focus,
    }),
  );

  const $buttonBarChildren = $buttonBar.children(
    ":not(.mr-xs.flex.shrink-0.items-center)",
  );

  if (CplxUserSettings.get().popupSettings.queryBoxSelectors.focus) {
    $buttonBarChildren.first().addClass("hidden");
  }

  setContainers($buttonBar[0]);

  refetchUserSettings();
}

function observeFollowUpQueryBox({
  id,
  location,
  setFollowUpContainers,
  refetchUserSettings,
}: {
  id: string;
  location: string;
  setFollowUpContainers: (containers: HTMLElement) => void;
  refetchUserSettings: () => void;
}) {
  if (location !== "thread" && location !== "page")
    return DomObserver.destroy(id);

  const $toolbar = $('textarea[placeholder="Ask follow-up"]').parent().next();

  if (!$toolbar.length || $toolbar.attr(`data-${id}`)) return;

  $toolbar.attr(`data-${id}`, "true");

  const $selectorContainer = $("<div>").addClass(
    "tw-flex tw-flex-wrap tw-items-center tw-fade-in",
  );

  $toolbar.append($selectorContainer);

  setFollowUpContainers($selectorContainer[0]);

  refetchUserSettings();
}

function observeImageGenerationPopover({
  id,
  location,
  setImageGenPopoverContainer,
}: {
  id: string;
  location: string;
  setImageGenPopoverContainer: Dispatch<
    SetStateAction<HTMLElement | undefined>
  >;
}) {
  if (location !== "thread" && location !== "page")
    return DomObserver.destroy(id);

  const $generationOptionsGrid = $(
    "div.grid.grid-cols-2.gap-sm.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-transparent",
  );

  if (!$generationOptionsGrid.length) return;

  const $header = $generationOptionsGrid.prev();

  if ($header.attr(`data-${id}`)) return;

  $header.attr(`data-${id}`, "true");

  $header.parent().on("mousedown", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
  });

  setImageGenPopoverContainer($header[0]);
}

function alterAttachButton() {
  const $attachButton = $('button:contains("Attach"):last');

  if (
    $attachButton.length &&
    $attachButton.find(">div>div").text() === "Attach"
  ) {
    $attachButton.find(">div").removeClass("gap-xs");
    $attachButton.find(">div>div").addClass("hidden");
  }
}

function interceptPasteEvent() {
  if (!CplxUserSettings.get().popupSettings.qolTweaks.noFileCreationOnPaste)
    return;

  const $textarea = UiUtils.getActiveQueryBoxTextarea({});

  if (!$textarea.length || $textarea.attr("data-paste-event-intercepted"))
    return;

  $textarea.attr("data-paste-event-intercepted", "true");

  $textarea.on("paste", (e) => {
    const clipboardEvent = e.originalEvent as ClipboardEvent;

    if (clipboardEvent.clipboardData) {
      if (clipboardEvent.clipboardData.types.includes("text/plain")) {
        e.stopImmediatePropagation();
      }
    }
  });
}
