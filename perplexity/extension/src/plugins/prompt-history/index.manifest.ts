import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";
import { SlashCommandMenuTabShortcutSchema } from "@/plugins/__core__/slash-command/shortcuts.types.public";
import type { PromptHistory } from "@/plugins/prompt-history/types";
import { PromptHistorySchema } from "@/plugins/prompt-history/types";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    promptHistory: z.infer<typeof schema>;
  }

  interface PluginsIndexedDbRegistry {
    promptHistory: PromptHistory;
  }

  interface PluginsDbDataRegistry {
    promptHistory: PromptHistory[];
  }
}

const schema = z.object({
  enabled: z.boolean(),
  shortcut: SlashCommandMenuTabShortcutSchema,
  trigger: z.object({
    onSubmit: z.boolean(),
    onNavigation: z.boolean(),
  }),
});

export default definePlugin({
  meta: {
    id: "promptHistory",
    title: "Prompt History",
    description: "Reuse previous prompts",
    dashboardMeta: {
      tags: ["slashCommand"],
      categories: ["queryBox"],
      uiRouteSegment: "prompt-history",
    },
    dependencies: {
      uiGroups: ["slashCommandMenu:pages"],
      corePlugins: ["spaRouter", "networkIntercept", "slashCommand"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      shortcut: {
        type: "command",
        value: "h",
      },
      trigger: {
        onSubmit: true,
        onNavigation: true,
      },
    },
  },
  indexedDb: {
    versions: [
      {
        version: 6,
        schema: "&id, prompt, createdAt",
      },
    ],
    schema: PromptHistorySchema,
  },
});
