import { spaRouteChangeCompleteSubscribe } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { pplxCookiesStore } from "@/entrypoints/contexts/content-scripts/stores/pplx-cookies-store";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:incognitoByDefault": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:incognitoByDefault",
    dependencies: ["cache:pluginsEnableStatesV2", "store:pplxCookies"],
    loader({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) {
      if (!pluginsEnableStates.incognitoByDefault) return;

      spaRouteChangeCompleteSubscribe(
        async (url) => {
          const location = whereAmI(url);

          if (location !== "home") return;

          if (
            pplxCookiesStore
              .getState()
              .cookies.find((cookie) => cookie.name === "pplx.is-incognito")
              ?.value === "true"
          ) {
            return;
          }

          document.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: ";",
              ctrlKey: true,
              bubbles: true,
            }),
          );
        },
        {
          immediate: true,
        },
      );
    },
  });
}
