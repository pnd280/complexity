import {
  PLUGIN_CATEGORIES,
  PLUGIN_TAGS,
} from "@/data/dashboard/plugin-meta/consts";
import type {
  PluginCategory,
  PluginCategoryKey,
  PluginTag,
  PluginTagKeys,
} from "@/data/dashboard/plugin-meta/types";
import { isCometBrowserSync } from "@/utils/wrappers/comet";

export default class PluginMeta {
  static #categories: PluginCategory = PLUGIN_CATEGORIES;
  static #tags: PluginTag = PLUGIN_TAGS;

  static get tags() {
    return Object.fromEntries(
      Object.entries(this.#tags).filter(([key]) => {
        if (!isCometBrowserSync())
          return !(
            ["cometAssistant", "cometAssistantOnly"] as PluginTagKeys[]
          ).includes(key as PluginTagKeys);

        return true;
      }),
    );
  }

  static get categories() {
    return Object.fromEntries(
      Object.entries(this.#categories).filter(([key]) => {
        if (!isCometBrowserSync())
          return !(["comet"] as PluginCategoryKey[]).includes(
            key as PluginCategoryKey,
          );

        return true;
      }),
    );
  }
}
