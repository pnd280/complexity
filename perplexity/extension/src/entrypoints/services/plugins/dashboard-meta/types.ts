import type {
  PLUGIN_CATEGORIES,
  PLUGIN_TAGS,
} from "@/entrypoints/services/plugins/dashboard-meta/consts";

export type PluginTagKeys = keyof typeof PLUGIN_TAGS;

export type PluginCategoryKey = keyof typeof PLUGIN_CATEGORIES;

export type PluginTag = Record<string, { label: string; description: string }>;

export type PluginCategory = Record<
  string,
  { label: string; description: string }
>;
