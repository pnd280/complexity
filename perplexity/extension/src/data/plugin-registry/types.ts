import { PluginRegistry } from "@/data/plugin-registry";
import type { PluginCategory } from "@/data/plugin-registry/plugin-tags";
import type { PluginTagValues } from "@/data/plugin-registry/plugin-tags";
import type { CoreDomObserverId } from "@/plugins/_core/dom-observers/index.public";

import type { MainWorldCorePluginId } from "@/plugins/_core/main-world/index.public";
import type { UiGroupId } from "@/plugins/_core/ui/groups/index.public";

/**
 * Registry interface for plugin IDs and their corresponding persistent settings schema.
 *
 * Example usage in a plugin:
 * ```
 * declare module "path/to/plugins/settings/registry" {
 *   interface PluginsSettingsRegistry {
 *     myPluginId: MyPluginSettingsSchema;
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PluginsSettingsRegistry {}

export type PluginId = keyof PluginsSettingsRegistry;

export type PluginsSettingsSchema = {
  [K in keyof PluginsSettingsRegistry]: PluginsSettingsRegistry[K];
};

export type PluginManifest = {
  devOnly?: boolean;
  id: PluginId;
  settingsUiRouteSegment: string;
  title: string;
  description: React.ReactNode;
  tags: PluginTagValues[];
  categories: PluginCategory[];
  uiGroup?: UiGroupId[];
  dependentDomObservers?: CoreDomObserverId[];
  dependentMainWorldCorePlugins?: MainWorldCorePluginId[];
  dependentPlugins?: PluginId[];
  requiredPermissions?: {
    permission: chrome.runtime.ManifestPermissions;
    rationale: string;
  }[];
  optionalPermissions?: {
    permission: chrome.runtime.ManifestPermissions;
    rationale: string;
  }[];
};

export type TypedPluginManifest<T extends PluginId> = Omit<
  PluginManifest,
  "id"
> & {
  id: T;
};

export type PluginManifestsMap = {
  [K in PluginId]: TypedPluginManifest<K>;
};

export function isPluginId(value: string): value is PluginId {
  return Object.keys(PluginRegistry.manifests).includes(value);
}
