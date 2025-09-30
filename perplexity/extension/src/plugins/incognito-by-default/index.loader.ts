import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { pplxCookiesStore } from "@/plugins/__async-deps__/global-stores/pplx-cookies-store";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:incognitoByDefault": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:incognitoByDefault",
    dependencies: ["cache:pluginsEnableStates", "store:pplxCookies"],
    loader({ "cache:pluginsEnableStates": pluginsEnableStates }) {
      if (!pluginsEnableStates.incognitoByDefault) return;

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
  });
}
