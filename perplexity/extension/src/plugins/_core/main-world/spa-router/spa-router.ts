import { spaRouterRouteChangeEvent } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import type {
  RouterEvent,
  RouteChangeEventDetail,
} from "@/plugins/_core/main-world/spa-router/spa-router.types";
import {
  applyRouteIdAttribute,
  waitForRouteChangeComplete,
} from "@/plugins/_core/main-world/spa-router/utils";
import { waitForSpaIdle } from "@/utils/dom-utils/generics";
import { whereAmI } from "@/utils/misc/utils";

onlyMainWorldGuard();

export function proxySpaRouter() {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    dispatchRouteChange({ trigger: "push", newUrl: window.location.href });
    return result;
  };

  history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    dispatchRouteChange({ trigger: "replace", newUrl: window.location.href });

    return result;
  };

  window.addEventListener("popstate", () => {
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

      window.dispatchEvent(
        new CustomEvent<RouteChangeEventDetail>(spaRouterRouteChangeEvent, {
          detail: {
            state: "pending",
            trigger,
            newUrl: fullUrl,
          },
        }),
      );

      // await waitForRouteChangeComplete(whereAmI(fullUrl));

      await waitForSpaIdle();

      if (fullUrl !== lastDispatchedUrl) {
        console.warn(
          "[SPA Router] Stale state detected.",
          `Attempted to route to ${fullUrl} but the last dispatched url is ${lastDispatchedUrl}`,
        );
        return;
      }

      window.dispatchEvent(
        new CustomEvent<RouteChangeEventDetail>(spaRouterRouteChangeEvent, {
          detail: {
            state: "complete",
            trigger,
            newUrl: fullUrl,
          },
        }),
      );

      applyRouteIdAttribute(whereAmI(fullUrl));
    }
  };
})();
