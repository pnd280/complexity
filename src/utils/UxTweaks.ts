
import { throttle } from "lodash-es";

import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import UiUtils from "@/utils/UiUtils";
import { whereAmI } from "@/utils/utils";

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

  static removeConflictedMobileOverlay() {
    const handler = throttle(function () {
      if (window.innerWidth < 768) {
        const $navs = $(".h-mobileNavHeight");

        if ($navs.length < 2) return;

        $navs.first().remove();
      }
    }, 200);

    requestIdleCallback(() => {
      handler();
      $(window).on("resize", handler);
    });
  }
}
