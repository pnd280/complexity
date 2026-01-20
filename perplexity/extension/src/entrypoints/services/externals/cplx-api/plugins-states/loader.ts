import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { PluginsStatesV2Service } from "@/entrypoints/services/externals/cplx-api/plugins-states";
import { initializeLocalEnableStates } from "@/entrypoints/services/externals/cplx-api/plugins-states/utils";
import { CplxVersionsService } from "@/entrypoints/services/externals/cplx-api/remote-resources/versions";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "cache:pluginsEnableStates": ReturnType<
      typeof PluginsStatesV2Service.getEnableStatesCachedSync
    >;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "cache:pluginsEnableStates",
    dependencies: ["cache:pluginSettingSnapshots"],
    loader: async ({
      "cache:pluginSettingSnapshots": pluginSettingSnapshots,
    }) => {
      PluginsStatesV2Service.localEnableStates =
        await initializeLocalEnableStates(pluginSettingSnapshots);

      PluginsStatesV2Service.cplxVersions =
        await CplxVersionsService.inlineQueryFn(persistentQueryClient);

      PluginsStatesV2Service.featureCompat =
        await PluginsStatesV2Service.featureCompatInlineQueryFn();

      return PluginsStatesV2Service.getEnableStatesCachedSync();
    },
  });
}
