import { storage } from "@wxt-dev/storage";

import { DEFAULT_EXTENSION_SETTINGS } from "@/services/infra/extension-api-wrappers/extension-settings/defaults";
import { migrations } from "@/services/infra/extension-api-wrappers/extension-settings/migrations";
import { type ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";

export const backgroundProxyServiceName = "extensionSettingsStorageService";

/**
 * IMPORTANT: get/set operations must be orchestrated via a proxy service
 * when called from content scripts to prevent race conditions between multiple
 * content script instances and the background script.
 *
 * Other read-only data (or init a subscription) can be accessed directly via the storageItem.
 */
export class ExtensionSettingsStorageService {
  static storageItem = storage.defineItem<ExtensionSettings>("local:settings", {
    init: () => DEFAULT_EXTENSION_SETTINGS,
    fallback: DEFAULT_EXTENSION_SETTINGS,
    version: 3,
    migrations,
  });

  private static operationQueue: Promise<any> = Promise.resolve();

  static async getValue(): Promise<ExtensionSettings> {
    return (this.operationQueue = this.operationQueue.then(() =>
      ExtensionSettingsStorageService.storageItem.getValue(),
    ));
  }

  static async getMeta() {
    return (this.operationQueue = this.operationQueue.then(() =>
      ExtensionSettingsStorageService.storageItem.getMeta(),
    ));
  }

  static async setValue(value: ExtensionSettings) {
    return (this.operationQueue = this.operationQueue.then(() =>
      ExtensionSettingsStorageService.storageItem.setValue(value),
    ));
  }

  static async setMeta(meta: Parameters<typeof storage.setMeta>[0]) {
    return (this.operationQueue = this.operationQueue.then(() =>
      ExtensionSettingsStorageService.storageItem.setMeta(meta),
    ));
  }
}
