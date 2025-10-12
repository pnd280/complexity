import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { applyLayoutShiftPreventionInstantCss } from "@/plugins/better-sidebar/prevent-layout-shift.loader";
import { betterSidebarStore } from "@/plugins/better-sidebar/store";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { setCookie } from "@/utils/dom-utils/generics";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:betterSidebar:nativeSidebarPinStateListeners": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:betterSidebar:nativeSidebarPinStateListeners",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      betterSidebarStore.subscribe(
        (store) => store.open,
        (open) => {
          if (!pluginsEnableStates["betterSidebar"]) return;

          setCookie("isSidebarPinned", open.toString(), 365);

          void applyLayoutShiftPreventionInstantCss({
            enabled:
              ExtensionSettingsService.cachedSync.plugins["betterSidebar"]
                .shouldPreventLayoutShift,
          });
        },
        { equalityFn: deepEqual },
      );
    },
  });
}
