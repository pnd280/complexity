import { z } from "zod";

import { ThemeSchema } from "@/data/dashboard/themes/theme.types";
import { PromptHistorySchema } from "@/plugins/prompt-history/index.public";
import { BetterCodeBlockFineGrainedOptionsSchema } from "@/plugins/thread-better-code-blocks/index.public";
import { ExtensionSettingsSchema } from "@/services/infra/extension-settings/types";

export const ExtensionDataSchema = z.object({
  settings: z.object({
    settings: ExtensionSettingsSchema,
    settings$: z.object({
      v: z.number(),
    }),
  }),
  db: z.object({
    themes: z.array(ThemeSchema),
    betterCodeBlocksFineGrainedOptions: z.array(
      BetterCodeBlockFineGrainedOptionsSchema,
    ),
    promptHistory: z.array(PromptHistorySchema),
  }),
});

export type ExtensionData = z.infer<typeof ExtensionDataSchema>;
