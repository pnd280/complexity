import $ from "jquery";

import UIUtils from "./UI";
import { whereAmI } from "./utils";

export default class UXTweaks {
  static dropFileWithinThread(location: ReturnType<typeof whereAmI>) {
    const $threadWrapperWrapper = UIUtils.getThreadWrapper().parent();
    if (!$threadWrapperWrapper.length) return;

    if (location !== "thread") {
      return $threadWrapperWrapper.off("dragover drop");
    }

    if ($threadWrapperWrapper.attr("data-dropable")) return;

    $threadWrapperWrapper.attr("data-dropable", "true");

    $threadWrapperWrapper.on("dragover", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    $threadWrapperWrapper.on("drop", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const files = e.originalEvent?.dataTransfer?.files;
      if (!files?.length) return;

      const $queryBox = UIUtils.getActiveQueryBox({ type: "follow-up" });
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
    const $logo = $(".flex.items-center.mb-md.justify-between > *:first-child");

    if (!$logo.length) return;

    $logo.on("contextmenu", function (e) {
      e.stopPropagation();
    });
  }
}
