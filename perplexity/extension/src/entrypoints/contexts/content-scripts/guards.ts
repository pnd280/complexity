import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { APP_CONFIG } from "@/app.config";
import { WarningDialog } from "@/components/ExtensionContextInvalidationWatchdog";
import { invariant } from "@/utils/misc/utils";

export function contentScriptGuards() {
  ignoreInvalidPages();
  preventDuplication();
}

function ignoreInvalidPages() {
  const isCloudflareVerificationPage = $(document.body).hasClass("no-js");

  invariant(
    !isCloudflareVerificationPage,
    "[ContentScriptGuards] Invalid context",
  );
}

function preventDuplication() {
  if ($(document.body).attr("data-cplx-injected")) {
    // Firefox browsers always re-inject content scripts on extension update
    if (APP_CONFIG.BROWSER === "firefox") {
      if ($("#complexity-root-temp").length > 0) {
        return;
      }

      const $root = $("<div>")
        .attr("id", "complexity-root-temp")
        .appendTo(document.body);
      if ($root[0] == null) return;
      const root = createRoot($root[0]);
      root.render(createElement(WarningDialog));
    }

    throw new Error("Existing extension instance");
  }

  $(document.body).attr("data-cplx-injected", "true");
}
