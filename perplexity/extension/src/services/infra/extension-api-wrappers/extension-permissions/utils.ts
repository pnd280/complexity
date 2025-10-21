import { ExtensionPermissionsService } from "@/services/infra/extension-api-wrappers/extension-permissions/service-init.bg-worker";

export async function getPermissions(): Promise<chrome.permissions.Permissions> {
  return ExtensionPermissionsService.Instance.getAll();
}

export async function revokePermissions(
  permissions: chrome.runtime.ManifestPermissions[],
): Promise<boolean> {
  return ExtensionPermissionsService.Instance.remove(permissions);
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
