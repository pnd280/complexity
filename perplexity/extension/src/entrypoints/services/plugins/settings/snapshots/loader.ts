import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "cache:pluginSettingSnapshots": typeof PluginsSettingSnapshotsService.snapshots;
  }
}

export default async function () {
  AsyncLoaderRegistry.register({
    id: "cache:pluginSettingSnapshots",
    dependencies: [],
    loader: async () => {
      return PluginsSettingSnapshotsService.getSnapshots();
    },
  });
}
