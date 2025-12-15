import { storage, type WxtStorageItem } from "@wxt-dev/storage";

import type { ExtensionData } from "@/entrypoints/services/data-migration/types";
import { settingsStorage as extensionIconActionStorage } from "@/entrypoints/services/features/extension-icon-action/settings";

export async function exportExtensionMiscDataSettings(): Promise<
  ExtensionData["misc"]
> {
  return {
    [extensionIconActionStorage.key]: {
      settings: await extensionIconActionStorage.getValue(),
      meta: await extensionIconActionStorage.getMeta(),
    },
  };
}

export async function importExtensionMiscData(
  data: ExtensionData["misc"],
): Promise<void> {
  for (const [key, value] of Object.entries(data) as [
    WxtStorageItem<unknown, never>["key"],
    { settings: unknown; meta: unknown },
  ][]) {
    await storage.setItem(key, value.settings);
    if (Object.keys(value.meta ?? {}).length > 0) {
      await storage.setMeta(key, value.meta as Record<string, unknown>);
    }
  }
}
