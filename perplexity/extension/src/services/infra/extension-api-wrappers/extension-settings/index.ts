import { produce } from "immer";
import z from "zod";

import { ExtensionSettingsStorageService } from "@/services/infra/extension-api-wrappers/extension-settings/storage";
import { getExtensionSettingsStorageService } from "@/services/infra/extension-api-wrappers/extension-settings/storage/service-init.bg-worker";
import {
  ExtensionSettingsSchema,
  type ExtensionSettings,
} from "@/services/infra/extension-api-wrappers/extension-settings/types";
import { safeMerge } from "@/utils/safe-merge";
import { invariant, isInContentScript } from "@/utils/utils";

export class ExtensionSettingsService {
  private static cachedValue: ExtensionSettings | null = null;

  /**
   * Gets the extension settings
   * In content scripts, this can only be called once to maintain plugin state consistency in a session
   * @returns Promise resolving to the extension settings
   */
  static async get(): Promise<ExtensionSettings> {
    invariant(
      !(isInContentScript() && ExtensionSettingsService.cachedValue != null),
      "This method is only allowed to be called once in a content script",
    );

    const value = await getExtensionSettingsStorageService().getValue();

    const validationResult = ExtensionSettingsSchema.safeParse(value);

    if (!validationResult.success) {
      console.error(
        "Schema validation error:",
        JSON.stringify(z.treeifyError(validationResult.error), null, 2),
      );

      const merged = safeMerge(
        ExtensionSettingsSchema,
        value,
        ExtensionSettingsStorageService.storageItem.fallback,
      );

      ExtensionSettingsService.cachedValue = merged;

      await getExtensionSettingsStorageService().setValue(merged);

      return merged;
    }

    ExtensionSettingsService.cachedValue = value;

    return value;
  }

  /**
   * Gets the extension settings without updating the cache
   * For operations in content scripts that require both read/write access in a session
   * @returns Promise resolving to the extension settings
   */
  static async getWithoutCacheInvalidation(): Promise<ExtensionSettings> {
    invariant(
      isInContentScript(),
      "This method is only allowed in content scripts",
    );

    return await getExtensionSettingsStorageService().getValue();
  }

  public static get safeCachedSync(): ExtensionSettings | null {
    return ExtensionSettingsService.cachedValue;
  }

  /**
   * Gets the cached extension settings, throws if not initialized
   * @returns The cached extension settings
   * @throws If extension settings are not initialized
   */
  public static get cachedSync(): ExtensionSettings {
    const settings = ExtensionSettingsService.safeCachedSync;

    invariant(settings, "Extension settings are not initialized");

    return settings;
  }

  /**
   * Updates the extension settings using an Immer-style updater function
   * Content script's cache will not be affected in a session
   * @param updater Function that modifies the settings draft, either returning a new settings object or mutating the draft in place
   * @returns Promise resolving to the updated settings
   */
  public static async set(
    updater: (draft: ExtensionSettings) => void,
  ): Promise<ExtensionSettings> {
    const newSettings = produce(
      await (isInContentScript()
        ? ExtensionSettingsService.getWithoutCacheInvalidation()
        : ExtensionSettingsService.get()),
      updater,
    );

    await getExtensionSettingsStorageService().setValue(newSettings);

    return newSettings;
  }

  /**
   * Resets the extension settings to default values
   */
  public static async reset() {
    await getExtensionSettingsStorageService().setValue(
      ExtensionSettingsStorageService.storageItem.fallback,
    );
  }
}
