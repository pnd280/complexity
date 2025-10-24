import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache";
import { PluginsStatesService } from "@/plugins/__async-deps__/plugins-states";
import { CplxVersionsService } from "@/services/externals/cplx-api/remote-resources/versions";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "cache:pluginsEnableStates": ReturnType<
      typeof PluginsStatesService.getEnableStatesCachedSync
    >;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "cache:pluginsEnableStates",
    dependencies: ["cache:extensionSettings"],
    loader: async () => {
      return PluginsStatesService.getEnableStatesCachedSync({
        cplxVersions: await CplxVersionsService.inlineQueryFn(
          persistentQueryClient,
        ),
        featureCompat: await PluginsStatesService.featureCompatInlineQueryFn(),
      });
    },
  });
}
