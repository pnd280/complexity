import { sendMessage } from "webext-bridge/window";

import type { RouterEvent } from "@/plugins/_core/main-world/spa-router/spa-router.types";
import {
  applyRouteIdAttribute,
  waitForRouteChangeComplete,
} from "@/plugins/_core/main-world/spa-router/utils";
import { UiUtils } from "@/utils/ui-utils";
import { whereAmI } from "@/utils/utils";

onlyMainWorldGuard();

export function proxySpaRouter() {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    window.dispatchEvent(new Event("spaRouter:route-change"));
    window.dispatchEvent(new Event("spaRouter:history:pushState"));
    return result;
  };

  history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    window.dispatchEvent(new Event("spaRouter:route-change"));
    window.dispatchEvent(new Event("spaRouter:history:replaceState"));
    return result;
  };

  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("spaRouter:route-change"));
    window.dispatchEvent(new Event("spaRouter:history:popstate"));
  });

  window.addEventListener("spaRouter:history:pushState", () => {
    dispatchRouteChange({ trigger: "push", newUrl: window.location.href });
  });

  window.addEventListener("spaRouter:history:replaceState", () => {
    dispatchRouteChange({ trigger: "replace", newUrl: window.location.href });
  });

  window.addEventListener("spaRouter:history:popstate", () => {
    dispatchRouteChange({ trigger: "pop", newUrl: window.location.href });
  });

  applyRouteIdAttribute(whereAmI());
}

const dispatchRouteChange = (function () {
  let lastDispatchedUrl: string | null = null;

  return async function dispatchRouteChange({
    trigger,
    newUrl,
  }: {
    trigger: RouterEvent;
    newUrl: string;
  }) {
    const url = new URL(newUrl, window.location.href);
    const fullUrl = url.pathname + url.search + url.hash;

    if (fullUrl !== lastDispatchedUrl) {
      lastDispatchedUrl = fullUrl;

      sendMessage(
        "spaRouter:route-change",
        { state: "pending", trigger, newUrl: fullUrl },
        "content-script",
      );

      // await waitForRouteChangeComplete(whereAmI(fullUrl));

      await UiUtils.waitForSpaIdle();

      if (fullUrl !== lastDispatchedUrl) {
        console.warn(
          "[SPA Router] Stale state detected.",
          `Attempted to route to ${fullUrl} but the last dispatched url is ${lastDispatchedUrl}`,
        );
        return;
      }

      sendMessage(
        "spaRouter:route-change",
        { state: "complete", trigger, newUrl: fullUrl },
        "content-script",
      );

      applyRouteIdAttribute(whereAmI(fullUrl));
    }
  };
})();
