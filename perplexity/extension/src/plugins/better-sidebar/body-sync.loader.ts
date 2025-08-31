import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { betterSidebarStore } from "@/plugins/better-sidebar/store";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:betterSidebar:bodySync": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "plugin:betterSidebar:bodySync",
    dependencies: ["cache:pluginsStates"],
    loader: async ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["betterSidebar"]) return;

      betterSidebarStore.subscribe(
        (state) => state.open,
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
