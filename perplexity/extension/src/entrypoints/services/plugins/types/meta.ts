import type {
  PluginCategoryKey,
  PluginTagKeys,
} from "@/entrypoints/services/plugins/dashboard-meta/types";
import type { PluginId } from "@/entrypoints/services/plugins/types";

export type PluginMeta<T extends string = string> = {
  id: T;
  name: string;
  description: string;
  devOnly?: boolean;
};

export type PluginDependencies = {
  plugins: PluginId[];
};

export type PluginDashboardMeta = {
  tags: PluginTagKeys[];
  categories: PluginCategoryKey[];
  uiRouteSegment: string;
};

export type PluginPermissions = {
  requiredPermissions?: {
    permissions: chrome.runtime.ManifestPermission[];
    rationale: string;
  }[];
  optionalPermissions?: {
    permissions: chrome.runtime.ManifestPermission[];
    rationale: string;
  }[];
};
