import { PluginManifestsRegistry } from "@/__registries__/plugins";
import type { PluginId, PluginMeta } from "@/__registries__/plugins/meta.types";

export const OPTIONAL_PERMISSIONS = [
  "webNavigation",
] as const satisfies chrome.runtime.ManifestPermissions[];

type OptionalPermission = (typeof OPTIONAL_PERMISSIONS)[number];

type PermissionDetails = {
  title: string;
  dependantPlugins: PluginMeta<PluginId>[];
};

const permissionToPluginsMap = OPTIONAL_PERMISSIONS.reduce<
  Record<OptionalPermission, PluginMeta<PluginId>[]>
>(
  (acc, permission) => {
    acc[permission] = Object.values(PluginManifestsRegistry.meta).filter(
      ({ id }) =>
        PluginManifestsRegistry.meta[
          id
        ].extensionPermissions?.requiredPermissions?.some(
          (req) => req.permission === permission,
        ) ||
        PluginManifestsRegistry.meta[
          id
        ].extensionPermissions?.optionalPermissions?.some(
          (req) => req.permission === permission,
        ),
    );
    return acc;
  },
  {} as Record<OptionalPermission, PluginMeta<PluginId>[]>,
);

export const OPTIONAL_PERMISSIONS_DETAILS: Partial<
  Record<OptionalPermission, PermissionDetails>
> = {
  webNavigation: {
    title: "Web Navigation",
    dependantPlugins: permissionToPluginsMap["webNavigation"],
  },
};
