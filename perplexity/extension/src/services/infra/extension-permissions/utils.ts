import { getExtensionPermissionsService } from "@/services/infra/extension-permissions/index.proxy-service";

export async function getPermissions(): Promise<chrome.permissions.Permissions> {
  if (chrome.permissions != null) {
    return chrome.permissions.getAll();
  }
  return getExtensionPermissionsService().getAll();
}

export async function requestPermissions(
  permissions: chrome.runtime.ManifestPermissions[],
): Promise<boolean> {
  if (chrome.permissions != null) {
    return await chrome.permissions.request({
      permissions,
    });
  } else {
    return await getExtensionPermissionsService().request(permissions);
  }
}

export async function revokePermissions(
  permissions: chrome.runtime.ManifestPermissions[],
): Promise<boolean> {
  if (chrome.permissions != null) {
    return await chrome.permissions.remove({
      permissions,
    });
  } else {
    return await getExtensionPermissionsService().remove(permissions);
  }
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
