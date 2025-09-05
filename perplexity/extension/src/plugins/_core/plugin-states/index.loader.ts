import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { CplxVersionsService } from "@/services/externals/cplx-api/remote-resources/versions";
import { PluginsStatesService } from "@/services/features/plugins-states";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "cache:pluginsStates": ReturnType<
      typeof PluginsStatesService.getEnableStatesCachedSync
    >;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "cache:pluginsStates",
    dependencies: ["cache:extensionSettings"],
    loader: async () => {
      return PluginsStatesService.getEnableStatesCachedSync({
        cplxVersions: await CplxVersionsService.inlineQueryFn(),
        featureCompat: await PluginsStatesService.featureCompatInlineQueryFn(),
      });
    },
  });
}
