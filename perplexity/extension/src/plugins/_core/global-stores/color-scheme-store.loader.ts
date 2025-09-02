import { DomObserver } from "@/plugins/_core/dom-observers/_service";
import { createDomObserverId } from "@/plugins/_core/dom-observers/_service/types";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { colorSchemeStore } from "@/plugins/_core/global-stores/color-scheme-store";
import { UiUtils } from "@/utils/ui-utils";

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
      $("html").attr("data-color-scheme", UiUtils.getCurrentColorScheme());

      DomObserver.create(createDomObserverId("misc", "colorScheme"), {
        target: $("html")[0]!,
        config: {
          subtree: false,
          childList: false,
          attributes: true,
          attributeFilter: ["data-color-scheme"],
        },
        onMutation: () => {
          colorSchemeStore.setState((state) => {
            state.colorScheme =
              $("html").attr("data-color-scheme") === "dark" ? "dark" : "light";
          });
        },
      });
    },
  });
}
