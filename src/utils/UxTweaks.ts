import $ from "jquery";

import { WebAccessFocus } from "@/content-script/components/QueryBox";
import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import WebpageMessageInterceptor from "@/content-script/main-world/WebpageMessageInterceptors";
import { globalStore } from "@/content-script/session-store/global";
import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import UiUtils from "@/utils/UiUtils";
import { parseUrl, whereAmI } from "@/utils/utils";

export default class UxTweaks {
  static dropFileWithinThread(location: ReturnType<typeof whereAmI>) {
    if (
      !CplxUserSettings.get().generalSettings.qolTweaks
        .fileDropableThreadWrapper
    )
      return;

    const $threadWrapperWrapper = UiUtils.getThreadWrapper().parent();
    if (!$threadWrapperWrapper.length) return;

    if (location !== "thread") {
      return $threadWrapperWrapper.off("dragover drop");
    }

    if ($threadWrapperWrapper.attr("data-dropable")) return;

    $threadWrapperWrapper.attr("data-dropable", "true");

    $threadWrapperWrapper.on("dragover", function (e) {
      const filesTypes = e.originalEvent?.dataTransfer?.types;

      if (filesTypes?.length == null || !filesTypes.includes("Files")) return;

      e.preventDefault();
      e.stopPropagation();
    });

    $threadWrapperWrapper.on("drop", function (e) {
      const files = e.originalEvent?.dataTransfer?.files;

      if (files?.length == null) return;

      e.preventDefault();
      e.stopPropagation();

      const $queryBox = UiUtils.getActiveQueryBox({ type: "follow-up" });
      if (!$queryBox.length) return;

      const $fileInput = $queryBox.find('input[type="file"]');
      if (!$fileInput.length) return;

      const dataTransfer = new DataTransfer();
      Array.from(files).forEach((file) => dataTransfer.items.add(file));

      $fileInput.prop("files", dataTransfer.files);
      $fileInput[0].dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  static restoreLogoContextMenu() {
    const $logo = $(
      ".flex.items-center.mb-md.justify-between > *:first-child, .mt-xs.grow > .flex.items-center.justify-center:first-child > *:first-child",
    );

    if (!$logo.length) return;

    $logo.on("contextmenu", function (e) {
      e.stopPropagation();
    });
  }

  static handleCustomSearchParams() {
    const queryParams = parseUrl().queryParams;

    const route = (url: string) => {
      webpageMessenger.sendMessage({
        event: "routeToPage",
        payload: {
          url,
          scroll: false,
        },
      });
    };

    if (!queryParams.has("qq")) return;

    WebpageMessageInterceptor.alterNextQuery({
      proSearchState: queryParams.has("copilot"),
      focus: (queryParams.get("focus") ?? "internet") as WebAccessFocus["code"],
    });

    queryParams.set("q", queryParams.get("qq")!);
    queryParams.delete("qq");

    const newUrl = `/?${queryParams.toString()}`;

    const { isLongPollingCaptured, isWebSocketCaptured } =
      globalStore.getState();

    if (isLongPollingCaptured && isWebSocketCaptured) {
      return route(newUrl);
    }

    let redirectTimeout = window.setTimeout(() => {
      cleanup();
      if (!redirectTimeout) return;
      route(newUrl);
    }, 5000);

    const unsubscribe = globalStore.subscribe(
      ({ isLongPollingCaptured, isWebSocketCaptured }) => {
        if (!redirectTimeout) return cleanup();

        if (isLongPollingCaptured && isWebSocketCaptured) {
          cleanup();
          route(newUrl);
        }
      },
    );

    const cleanup = () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
        redirectTimeout = 0;
      }
      unsubscribe();
    };
  }
}
