import type { CorePluginsEnableStates } from "@/__registries__/core-plugins/types";
import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import CorePluginsEnableStatesService from "@/plugins/__core__/enable-states";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "cache:corePlugins:enableStates": CorePluginsEnableStates;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "cache:corePlugins:enableStates",
    dependencies: ["cache:pluginsEnableStates", "cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      return CorePluginsEnableStatesService.getEnableStates({
        pluginsEnableStates,
      });
    },
  });
}
