import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "cache:extensionSettings": ExtensionSettings;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "cache:extensionSettings",
    dependencies: [],
    loader: async () => {
      return await ExtensionSettingsService.get();
    },
  });
}
