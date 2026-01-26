import {
  PLUGIN_CATEGORIES,
  PLUGIN_TAGS,
} from "@/entrypoints/services/plugins/dashboard-meta/consts";
import type {
  PluginCategory,
  PluginCategoryKey,
  PluginTag,
  PluginTagKeys,
} from "@/entrypoints/services/plugins/dashboard-meta/types";
import { isCometBrowserSync } from "@/entrypoints/utils/comet";

export default class PluginDashboardMetaConsts {
  static #categories: PluginCategory = PLUGIN_CATEGORIES;
  static #tags: PluginTag = PLUGIN_TAGS;

  static get tags() {
    return Object.fromEntries(
      Object.entries(this.#tags).filter(([key]) => {
        if (!isCometBrowserSync())
          return !(
            [
              "cometAssistant",
              "cometAssistantOnly",
            ] satisfies PluginTagKeys[] as PluginTagKeys[]
          ).includes(key as PluginTagKeys);

        return true;
      }),
    );
  }

  static get categories() {
    return Object.fromEntries(
      Object.entries(this.#categories).filter(([key]) => {
        if (!isCometBrowserSync())
          return !(
            ["comet"] satisfies PluginCategoryKey[] as PluginCategoryKey[]
          ).includes(key as PluginCategoryKey);

        return true;
      }),
    );
  }
}
