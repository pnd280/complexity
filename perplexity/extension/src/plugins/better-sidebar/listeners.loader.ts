import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import { applyLayoutShiftPreventionInstantCss } from "@/plugins/better-sidebar/prevent-layout-shift.loader";
import { betterSidebarStore } from "@/plugins/better-sidebar/store";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:betterSidebar:nativeSidebarPinStateListeners": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:betterSidebar:nativeSidebarPinStateListeners",
    dependencies: ["cache:pluginsEnableStatesV2"],
    loader: ({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) => {
      betterSidebarStore.subscribe(
        (store) => store.open,
        (open) => {
          if (!pluginsEnableStates["betterSidebar"]) return;

          localStorage.setItem(
            "pplx.local-user-settings.isSidebarPinned",
            open.toString(),
          );

          void applyLayoutShiftPreventionInstantCss({
            enabled:
              PluginsSettingSnapshotsService.getPluginSnapshot("betterSidebar")
                .shouldPreventLayoutShift,
          });
        },
        { equalityFn: deepEqual },
      );
    },
  });
}
