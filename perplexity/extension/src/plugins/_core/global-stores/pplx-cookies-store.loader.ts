import debounce from "lodash/debounce";

import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { DomObserver } from "@/plugins/_core/dom-observers/_service";
import { createDomObserverId } from "@/plugins/_core/dom-observers/_service/types";
import {
  pplxCookiesStore,
  type Cookie,
} from "@/plugins/_core/global-stores/pplx-cookies-store";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "store:pplxCookies": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "store:pplxCookies",
    dependencies: ["cache:extensionSettings"],
    loader: () => {
      parseCookies();

      DomObserver.create(createDomObserverId("misc", "pplxCookies"), {
        target: document.body,
        config: { childList: true, subtree: true },
        onMutation: parseCookies(),
      });
    },
  });
}

export function parseCookies() {
  return debounce(
    () => {
      const cookieStrings = document.cookie.split(";");

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
    300,
    { leading: true, trailing: true },
  );
}
