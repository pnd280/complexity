import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { colorSchemeStore } from "@/plugins/_core/global-stores/color-scheme-store";
import { getCurrentColorScheme } from "@/utils/dom-utils/generics";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "store:colorScheme": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "store:colorScheme",
    dependencies: ["cache:extensionSettings"],
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
