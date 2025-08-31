import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { pplxCookiesStore } from "@/plugins/_core/global-stores/pplx-cookies-store";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:incognitoByDefault": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "plugin:incognitoByDefault",
    dependencies: ["cache:pluginsStates", "store:pplxCookies"],
    loader({ "cache:pluginsStates": pluginsStates }) {
      if (!pluginsStates.incognitoByDefault) return;

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
