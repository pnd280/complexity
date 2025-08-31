import type { ExtensionSettingsStorageService } from "@/services/infra/extension-api-wrappers/extension-settings/storage";
import { getExtensionSettingsStorageProxyService } from "@/services/infra/extension-api-wrappers/extension-settings/storage/proxy";
import { getExtensionSettingsStorageRootService } from "@/services/infra/extension-api-wrappers/extension-settings/storage/proxy-register.bg-worker";
import { isBackgroundScript } from "@/utils/utils";

export function getExtensionSettingsStorageService(): typeof ExtensionSettingsStorageService {
  return isBackgroundScript()
    ? getExtensionSettingsStorageRootService()
    : getExtensionSettingsStorageProxyService();
}
