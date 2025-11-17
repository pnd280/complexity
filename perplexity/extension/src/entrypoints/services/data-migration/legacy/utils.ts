import { storage } from "@wxt-dev/storage";

import {
  LegacyExtensionSettingsSchema,
  type LegacyExtensionSettings,
} from "@/entrypoints/services/data-migration/legacy/types";

export const legacyExtensionSettingsKey = "local:settings";

export const getLegacyExtensionSettings = (() => {
  let cachedPromise: Promise<LegacyExtensionSettings | null> | null = null;

  return async (): Promise<LegacyExtensionSettings | null> => {
    if (cachedPromise) {
      return cachedPromise;
    }

    cachedPromise = (async () => {
      const rawData = await storage.getItem<unknown>(
        legacyExtensionSettingsKey,
      );
      return LegacyExtensionSettingsSchema.safeParse(rawData).data ?? null;
    })();

    return cachedPromise;
  };
})();
