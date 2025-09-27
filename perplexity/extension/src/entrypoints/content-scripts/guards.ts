import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { APP_CONFIG } from "@/app.config";
import { WarningDialog } from "@/components/ExtensionContextInvalidationWatchdog";
import { invariant } from "@/utils/misc/utils";

export function contentScriptGuards() {
  ignoreInvalidPages();
  checkForExistingExtensionInstance();
}

function ignoreInvalidPages() {
  const isCloudflareVerificationPage = $(document.body).hasClass("no-js");

  invariant(!isCloudflareVerificationPage, "Cloudflare verification page");
}

function checkForExistingExtensionInstance() {
  if ($(document.body).attr("data-cplx-injected")) {
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
