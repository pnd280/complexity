import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { betterSidebarStore } from "@/plugins/better-sidebar/store";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:betterSidebar:bodySync": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:betterSidebar:bodySync",
    dependencies: ["cache:pluginsEnableStates"],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
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
