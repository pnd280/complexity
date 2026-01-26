import debounce from "lodash/debounce";

import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import {
  pplxCookiesStore,
  type Cookie,
} from "@/entrypoints/contexts/content-scripts/stores/pplx-cookies-store";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "store:pplxCookies": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "store:pplxCookies",
    dependencies: ["cache:pluginSettingSnapshots"],
    loader: () => {
      parseCookies();
      const observer = new MutationObserver(parseCookies());
      observer.observe(document.body, { childList: true, subtree: true });
    },
  });
}

function parseCookies() {
  let prevCookieString = "";

  return debounce(
    () => {
      const currentCookieString = document.cookie;

      if (currentCookieString === prevCookieString) {
        return;
      }

      prevCookieString = currentCookieString;

      const cookieStrings = currentCookieString.split(";");

      const parsedCookies: Cookie[] = cookieStrings
        .map((cookieStr) => {
          const parts = cookieStr.trim().split("=");
          if (parts.length !== 2) return null;
          const [cookieName, cookieValue] = parts;
          if (!cookieName) return null;
          return {
            name: cookieName,
            value: cookieValue,
          };
        })
        .filter((cookie): cookie is Cookie => cookie != null);

      const prevCookies = pplxCookiesStore.getState().cookies;

      const hasChanged =
        prevCookies.length !== parsedCookies.length ||
        prevCookies.some(
          (prevCookie, index) =>
            !parsedCookies[index] ||
            prevCookie.name !== parsedCookies[index].name ||
            prevCookie.value !== parsedCookies[index].value,
        );

      if (hasChanged) {
        pplxCookiesStore.setState({ cookies: parsedCookies });
      }
    },
    150,
    { leading: true, trailing: true },
  );
}
