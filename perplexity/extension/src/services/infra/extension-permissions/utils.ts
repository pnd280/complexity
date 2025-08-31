import { getExtensionPermissionsProxyService } from "@/services/infra/extension-permissions/proxy";
import { getExtensionPermissionsService } from "@/services/infra/extension-permissions/proxy-register.bg-worker";
import { isBackgroundScript } from "@/utils/utils";

const getService = isBackgroundScript()
  ? getExtensionPermissionsService
  : getExtensionPermissionsProxyService;

export async function getPermissions(): Promise<chrome.permissions.Permissions> {
  return getService().getAll();
}

export async function requestPermissions(
  permissions: chrome.runtime.ManifestPermissions[],
): Promise<boolean> {
  return getService().request(permissions);
}

export async function revokePermissions(
  permissions: chrome.runtime.ManifestPermissions[],
): Promise<boolean> {
  return getService().remove(permissions);
}

export async function hasPermissions(
  permissions: chrome.runtime.ManifestPermissions[],
): Promise<boolean> {
  const { permissions: grantedPermissions } = await getPermissions();

  if (grantedPermissions == null) return false;

  return permissions.every((permission) =>
    grantedPermissions.includes(permission),
  );
}

export function hasPermissionsSync({
  grantedPermissions,
  requiredPermissions,
}: {
  grantedPermissions: chrome.runtime.ManifestPermissions[];
  requiredPermissions: chrome.runtime.ManifestPermissions[];
}): boolean {
  return requiredPermissions.every((permission) =>
    grantedPermissions.includes(permission),
  );
}
