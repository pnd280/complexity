import { storage } from "@wxt-dev/storage";
import { produce } from "immer";
import z from "zod";

import { DEFAULT_EXTENSION_SETTINGS } from "@/services/extension-settings/defaults";
import { migrations } from "@/services/extension-settings/migrations";
import {
  ExtensionSettingsSchema,
  type ExtensionSettings,
} from "@/services/extension-settings/types";
import { safeMerge } from "@/utils/safe-merge";
import { invariant, isInContentScript } from "@/utils/utils";

export class ExtensionSettingsService {
  static storageItem = storage.defineItem<ExtensionSettings>("local:settings", {
    init: () => DEFAULT_EXTENSION_SETTINGS,
    fallback: DEFAULT_EXTENSION_SETTINGS,
    version: 3,
    migrations,
  });

  private static cachedValue: ExtensionSettings | null = null;

  /**
   * Gets the extension settings
   * In content scripts, this can only be called once to maintain plugin state consistency
   * @returns Promise resolving to the extension settings
   */
  static async get(): Promise<ExtensionSettings> {
    invariant(
      !(isInContentScript() && ExtensionSettingsService.cachedValue != null),
      "This method is not allowed to call more than once in a content script",
    );

    const value = await ExtensionSettingsService.storageItem.getValue();

    const validationResult = ExtensionSettingsSchema.safeParse(value);

    if (!validationResult.success) {
      console.error(z.treeifyError(validationResult.error));

      const merged = safeMerge(
        ExtensionSettingsSchema,
        value,
        ExtensionSettingsService.storageItem.fallback,
      );

      ExtensionSettingsService.cachedValue = merged;

      await ExtensionSettingsService.storageItem.setValue(merged);

      return merged;
    }

    ExtensionSettingsService.cachedValue = value;

    return value;
  }

  /**
   * Gets the extension settings without updating the cache
   * For operations in content scripts that require both read/write access
   * @returns Promise resolving to the extension settings
   */
  static async getWithoutCacheInvalidation(): Promise<ExtensionSettings> {
    invariant(
      isInContentScript(),
      "This method is only allowed in content scripts",
    );

    return await ExtensionSettingsService.storageItem.getValue();
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
   * Content script's cache will not be affected
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

    await ExtensionSettingsService.storageItem.setValue(newSettings);

    return newSettings;
  }

  /**
   * Resets the extension settings to default values
   */
  public static async reset() {
    await ExtensionSettingsService.storageItem.setValue(
      ExtensionSettingsService.storageItem.fallback,
    );
  }
}
