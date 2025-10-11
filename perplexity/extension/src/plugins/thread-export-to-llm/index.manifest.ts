import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    threadExportToLlm: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  exportFormat: z.enum(["json", "markdown", "plaintext"]),
  includeMetadata: z.boolean(),
  targetLlm: z.enum(["ai-studio", "claude", "chatgpt", "custom"]),
  customApiEndpoint: z.string().optional(),
});

export default definePlugin({
  meta: {
    id: "threadExportToLlm",
    title: "Thread Export to LLM",
    description:
      "Export entire conversation threads with context to other LLMs like AI Studio",
    dashboardMeta: {
      tags: ["ui"],
      categories: ["thread"],
      uiRouteSegment: "thread-export-to-llm",
    },
    dependencies: {
      corePlugins: ["spaRouter", "domObservers:thread:messageBlocks"],
      uiGroups: ["thread:messageBlocks:footer"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      exportFormat: "markdown",
      includeMetadata: true,
      targetLlm: "ai-studio",
    },
  },
});
