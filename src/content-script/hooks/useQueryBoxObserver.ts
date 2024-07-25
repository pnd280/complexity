import $ from "jquery";
import { useEffect } from "react";

import CPLXUserSettings from "@/lib/CPLXUserSettings";
import { cn } from "@/utils/cn";
import DOMObserver from "@/utils/DOMObserver";
import UIUtils from "@/utils/UI";
import { whereAmI } from "@/utils/utils";

import useRouter from "./useRouter";

type UseQueryBoxObserverProps = {
  setContainers: (containers: Element) => void;
  setFollowUpContainers: (containers: Element) => void;
  refetchUserSettings: () => void;
  disabled?: boolean;
};

export default function useQueryBoxObserver({
  setContainers,
  setFollowUpContainers,
  refetchUserSettings,
  disabled,
}: UseQueryBoxObserverProps) {
  const location = whereAmI(useRouter().url);

  useEffect(
    function mainQueryBoxObserver() {
      const mainId = "main-query-box-selectors";
      const followUpId = "follow-up-query-box-selectors";
      const alterAttachButtonId = "alter-attach-button";

      DOMObserver.create(mainId, {
        target: document.body,
        config: { childList: true, subtree: true },
        source: "hook",
        onAny: () => {
          queueMicrotask(() =>
            observeMainQueryBox({
              id: mainId,
              disabled,
              setContainers,
              refetchUserSettings,
            }),
          );

          queueMicrotask(() =>
            observeFollowUpQueryBox({
              id: followUpId,
              location,
              disabled,
              setFollowUpContainers,
              refetchUserSettings,
            }),
          );

          queueMicrotask(alterAttachButton);

          queueMicrotask(interceptPasteEvent);
        },
      });

      return () => {
        DOMObserver.destroy(mainId);
        DOMObserver.destroy(followUpId);
        DOMObserver.destroy(alterAttachButtonId);
      };
    },
    [
      disabled,
      location,
      refetchUserSettings,
      setContainers,
      setFollowUpContainers,
    ],
  );
}

function observeMainQueryBox({
  id,
  disabled,
  setContainers,
  refetchUserSettings,
}: {
  id: string;
  disabled?: boolean;
  setContainers: (containers: Element) => void;
  refetchUserSettings: () => void;
}) {
  if (disabled) return;

  const $buttonBar = UIUtils.getActiveQueryBoxTextarea({ type: "main" })
    .parent()
    .next();

  if (!$buttonBar.length || $buttonBar.attr(`data-${id}`)) return;

  $buttonBar.attr(`data-${id}`, "true");

  $buttonBar.addClass(() =>
    cn("tw-col-span-3 tw-col-start-1 !tw-col-end-4 tw-flex-wrap tw-gap-y-1", {
      "tw-mr-[7rem]":
        !CPLXUserSettings.get().popupSettings.queryBoxSelectors.focus,
      "tw-mr-10": CPLXUserSettings.get().popupSettings.queryBoxSelectors.focus,
    }),
  );

  const $buttonBarChildren = $buttonBar.children(
    ":not(.mr-xs.flex.shrink-0.items-center)",
  );

  if (CPLXUserSettings.get().popupSettings.queryBoxSelectors.focus) {
    $buttonBarChildren.first().addClass("hidden");
  }

  setContainers($buttonBar[0]);

  refetchUserSettings();
}

function observeFollowUpQueryBox({
  id,
  location,
  disabled,
  setFollowUpContainers,
  refetchUserSettings,
}: {
  id: string;
  location: string;
  disabled?: boolean;
  setFollowUpContainers: (containers: Element) => void;
  refetchUserSettings: () => void;
}) {
  if (location === "thread" || location === "page") {
    DOMObserver.create(id, {
      target: document.body,
      config: { childList: true, subtree: true },
      throttleTime: 200,
      source: "hook",
      onAdd() {
        if (disabled) return;

        const $toolbar = $('textarea[placeholder="Ask follow-up"]')
          .parent()
          .next();

        if (!$toolbar.length || $toolbar.attr(`data-${id}`)) return;

        $toolbar.attr(`data-${id}`, "true");

        const $selectorContainer = $("<div>").addClass(
          "tw-flex tw-flex-wrap tw-items-center tw-zoom-in",
        );

        $toolbar.append($selectorContainer);

        setFollowUpContainers($selectorContainer[0]);

        refetchUserSettings();
      },
    });
  } else {
    DOMObserver.destroy(id);
  }
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
  if (!CPLXUserSettings.get().popupSettings.qolTweaks.noFileCreationOnPaste)
    return;

  const $textarea = UIUtils.getActiveQueryBoxTextarea({});

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
