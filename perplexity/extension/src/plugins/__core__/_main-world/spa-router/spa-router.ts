import { spaRouterRouteChangeEvent } from "@/plugins/__core__/_main-world/spa-router/listeners.loader";
import type {
  RouterEvent,
  RouteChangeEventDetail,
} from "@/plugins/__core__/_main-world/spa-router/spa-router.types";
import {
  applyRouteIdAttribute,
  waitForRouteChangeComplete,
} from "@/plugins/__core__/_main-world/spa-router/utils";
import { waitForSpaIdle } from "@/utils/dom-utils/generics";
import { whereAmI } from "@/utils/misc/utils";

export function proxySpaRouter() {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    void dispatchRouteChange({ trigger: "push", newUrl: window.location.href });
    return result;
  };

  history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    void dispatchRouteChange({
      trigger: "replace",
      newUrl: window.location.href,
    });

    return result;
  };

  window.addEventListener("popstate", () => {
    void dispatchRouteChange({ trigger: "pop", newUrl: window.location.href });
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
    const url = new URL(newUrl, window.location.href).toString();

    if (url !== lastDispatchedUrl) {
      lastDispatchedUrl = url;

      window.dispatchEvent(
        new CustomEvent<RouteChangeEventDetail>(spaRouterRouteChangeEvent, {
          detail: {
            state: "pending",
            trigger,
            newUrl: url,
          },
        }),
      );

      // await waitForRouteChangeComplete(whereAmI(url));

      await waitForSpaIdle();

      if (url !== lastDispatchedUrl) {
        console.warn(
          "[SPA Router] Stale state detected.",
          `Attempted to route to ${url} but the last dispatched url is ${lastDispatchedUrl}`,
        );
        return;
      }

      window.dispatchEvent(
        new CustomEvent<RouteChangeEventDetail>(spaRouterRouteChangeEvent, {
          detail: {
            state: "complete",
            trigger,
            newUrl: url,
          },
        }),
      );

      applyRouteIdAttribute(whereAmI(url));
    }
  };
})();
