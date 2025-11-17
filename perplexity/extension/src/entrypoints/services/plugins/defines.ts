import type z from "zod";

import type {
  PluginDashboardMeta,
  PluginDependencies,
  PluginIndexedDbSchemas,
  PluginMeta,
  PluginPermissions,
  PluginSettingsSchemas,
} from "@/entrypoints/services/plugins/types";

type Strict<T, Shape> = T & { [K in Exclude<keyof T, keyof Shape>]: never };

export function definePluginMeta<const T extends PluginMeta>(
  meta: Strict<T, PluginMeta>,
): T {
  return meta;
}

export function definePluginDependencies<const T extends PluginDependencies>(
  dependencies: Strict<T, PluginDependencies>,
): T {
  return dependencies;
}

export function definePluginDashboardMeta<const T extends PluginDashboardMeta>(
  dashboardMeta: Strict<T, PluginDashboardMeta>,
): T {
  return dashboardMeta;
}

type ExtractSchemas<T> = {
  [K in keyof T]: T[K] extends { schema: infer S } ? S : never;
};

export function definePluginSettingsSchemas<
  const T extends PluginSettingsSchemas<
    Record<number, z.ZodSchema<{ enabled: boolean }>>
  >,
>(schemas: T & PluginSettingsSchemas<ExtractSchemas<T>>): T {
  const sorted = Object.keys(schemas)
    .sort((a, b) => Number(a) - Number(b))
    .reduce((acc, key) => {
      acc[key as keyof T] = schemas[key as keyof T];
      return acc;
    }, {} as T);

  return sorted;
}

export function definePluginIndexedDbSchemas<
  const T extends PluginIndexedDbSchemas["schemas"],
>(
  schemas: T,
  options?: PluginIndexedDbSchemas["options"],
): {
  schemas: T;
  options?: PluginIndexedDbSchemas["options"];
} {
  return {
    schemas: Object.keys(schemas)
      .sort((a, b) => Number(a) - Number(b))
      .reduce((acc, key) => {
        acc[key as keyof T] = schemas[key as keyof T];
        return acc;
      }, {} as T),
    options,
  };
}

export function definePluginPermissions<const T extends PluginPermissions>(
  permissions: Strict<T, PluginPermissions>,
): T {
  return permissions;
}
