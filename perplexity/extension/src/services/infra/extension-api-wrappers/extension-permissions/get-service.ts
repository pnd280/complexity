import type { ExtensionPermissionsService } from "@/services/infra/extension-api-wrappers/extension-permissions";
import { getExtensionPermissionsProxyService } from "@/services/infra/extension-api-wrappers/extension-permissions/proxy";
import { getExtensionPermissionsRootService } from "@/services/infra/extension-api-wrappers/extension-permissions/proxy-register.bg-worker";
import { isBackgroundScript } from "@/utils/utils";

export function getExtensionPermissionsService(): typeof ExtensionPermissionsService {
  return isBackgroundScript()
    ? getExtensionPermissionsRootService()
    : getExtensionPermissionsProxyService();
}
