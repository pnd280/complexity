import { PluginRegistry } from "@/data/plugin-registry";
import type { PluginManifest } from "@/data/plugin-registry/types";

export const OPTIONAL_PERMISSIONS = [
  "webNavigation",
] as const satisfies chrome.runtime.ManifestPermissions[];

type OptionalPermission = (typeof OPTIONAL_PERMISSIONS)[number];

type PermissionDetails = {
  title: string;
  dependantPlugins: PluginManifest[];
};

const permissionToPluginsMap = OPTIONAL_PERMISSIONS.reduce<
  Record<OptionalPermission, PluginManifest[]>
>(
  (acc, permission) => {
    acc[permission] = Object.values(PluginRegistry.manifests).filter(
      ({ id }) =>
        PluginRegistry.manifests[id]?.requiredPermissions?.some(
          (req) => req.permission === permission,
        ) ||
        PluginRegistry.manifests[id]?.optionalPermissions?.some(
          (req) => req.permission === permission,
        ),
    );
    return acc;
  },
  {} as Record<OptionalPermission, PluginManifest[]>,
);

export const OPTIONAL_PERMISSIONS_DETAILS: Partial<
  Record<OptionalPermission, PermissionDetails>
> = {
  webNavigation: {
    title: "Web Navigation",
    dependantPlugins: permissionToPluginsMap["webNavigation"],
  },
};
