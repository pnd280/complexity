import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { colorSchemeStore } from "@/entrypoints/contexts/content-scripts/stores/color-scheme-store";
import { getCurrentColorScheme } from "@/utils/dom-utils/generics";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "store:colorScheme": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "store:colorScheme",
    dependencies: ["cache:pluginSettingSnapshots"],
    loader: () => {
      $("html").attr("data-color-scheme", getCurrentColorScheme());

      const handler = () => {
        colorSchemeStore.setState((state) => {
          state.colorScheme =
            document.documentElement.getAttribute("data-color-scheme") ===
            "dark"
              ? "dark"
              : "light";
        });
      };

      handler();

      const observer = new MutationObserver(handler);

      observer.observe(document.documentElement, {
        subtree: false,
        childList: false,
        attributes: true,
        attributeFilter: ["data-color-scheme"],
      });
    },
  });
}
