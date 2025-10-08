import type { Transaction } from "dexie";
import type Dexie from "dexie";
import type z from "zod";

import type { CorePluginId } from "@/__registries__/core-plugins/types";
import type { UiGroupId } from "@/__registries__/cs-ui/types";
import type {
  PluginCategory,
  PluginTagValues,
} from "@/data/dashboard/plugin-tags";

export type PluginMeta<T extends PluginId> = {
  devOnly?: boolean;

  id: T;
  title: string;
  description: string;

  dashboardMeta: {
    tags: readonly PluginTagValues[];
    categories: readonly PluginCategory[];
    uiRouteSegment: string;
  };

  dependencies?: {
    corePlugins?: readonly CorePluginId[];
    uiGroups?: readonly UiGroupId[];
    plugins?: readonly PluginId[];
  };

  extensionPermissions?: {
    requiredPermissions?: ReadonlyArray<{
      permission: chrome.runtime.ManifestPermissions;
      rationale: string;
    }>;
    optionalPermissions?: ReadonlyArray<{
      permission: chrome.runtime.ManifestPermissions;
      rationale: string;
    }>;
  };
};

export type PluginMetaMap = {
  [K in PluginId]: PluginMeta<K>;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PluginsSettingsRegistry {}

/**
 * Derived type that maps plugin IDs to their settings schemas.
 */
export type PluginsSettingsSchema = {
  [K in keyof PluginsSettingsRegistry]: PluginsSettingsRegistry[K];
};

/**
 * Union type of all registered plugin IDs.
 */
export type PluginId = keyof PluginsSettingsRegistry;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PluginsIndexedDbRegistry {}

export type PluginsIndexedDbSchema = {
  [K in keyof PluginsIndexedDbRegistry]: PluginsIndexedDbRegistry[K];
};

export type PluginTables = {
  [K in keyof PluginsIndexedDbRegistry]: Dexie.Table<
    PluginsIndexedDbRegistry[K]
  >;
};

export type PluginIndexedDbVersion = {
  version: number;
  schema?: string;
  tableName?: string;
  upgrade?: (tx: Transaction) => Promise<void> | void;
};

export type PluginIndexedDbConfig = {
  versions: PluginIndexedDbVersion[];
  schema?: z.ZodType<any>;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PluginsDbDataRegistry {}

export type PluginsDbDataSchema = {
  [K in keyof PluginsDbDataRegistry]: PluginsDbDataRegistry[K];
};
