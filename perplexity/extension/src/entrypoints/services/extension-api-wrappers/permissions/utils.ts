import { ExtensionPermissionsService } from "@/entrypoints/services/extension-api-wrappers/permissions/service-init.bg-worker";

export async function getPermissions(): Promise<chrome.permissions.Permissions> {
  return ExtensionPermissionsService.Instance.getAll();
}

export async function revokePermissions(
  permissions: chrome.runtime.ManifestPermission[],
): Promise<boolean> {
  return ExtensionPermissionsService.Instance.remove(permissions);
}

export async function hasPermissions(
  permissions: chrome.runtime.ManifestPermission[],
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
  grantedPermissions: chrome.runtime.ManifestPermission[];
  requiredPermissions: chrome.runtime.ManifestPermission[];
}): boolean {
  return requiredPermissions.every((permission) =>
    grantedPermissions.includes(permission),
  );
}
