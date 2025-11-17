import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { betterSidebarStore } from "@/plugins/better-sidebar/store";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:betterSidebar:bodySync": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:betterSidebar:bodySync",
    dependencies: ["cache:pluginsEnableStatesV2"],
    loader: async ({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) => {
      if (!pluginsEnableStates["betterSidebar"]) return;

      betterSidebarStore.subscribe(
        (store) => store.open,
        (open) => {
          $(document.body).attr(
            "cplx-better-sidebar-state",
            open ? "expanded" : "collapsed",
          );
        },
        {
          equalityFn: deepEqual,
          fireImmediately: true,
        },
      );
    },
  });
}
