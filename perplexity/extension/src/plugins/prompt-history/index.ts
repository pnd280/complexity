import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";
import type { PromptHistory } from "@/plugins/prompt-history/types";
import { PromptHistorySchema } from "@/plugins/prompt-history/types";
import { SlashCommandMenuTabShortcutSchema } from "@/plugins/slash-command/shortcuts.types.public";

declare module "@/data/plugin-registry/types" {
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
  manifest: {
    id: "promptHistory",
    settingsUiRouteSegment: "prompt-history",
    title: "Prompt History",
    description: "Reuse previous prompts",
    categories: ["featured", "queryBox"],
    tags: ["slashCommand"],
    dependentDomObservers: ["queryBoxes"],
    dependentPlugins: ["slashCommand"],
    dependentMainWorldCorePlugins: ["spaRouter", "networkIntercept"],
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
