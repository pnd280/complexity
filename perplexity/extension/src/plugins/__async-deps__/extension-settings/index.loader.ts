import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "cache:extensionSettings": ExtensionSettings;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "cache:extensionSettings",
    dependencies: [],
    loader: async () => {
      return await ExtensionSettingsService.get();
    },
  });
}
