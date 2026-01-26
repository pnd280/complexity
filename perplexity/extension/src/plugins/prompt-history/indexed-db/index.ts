import { definePluginIndexedDbSchemas } from "@/entrypoints/services/plugins/defines";
import { PromptHistorySchema } from "@/plugins/prompt-history/types";

export const indexedDbSchemas = definePluginIndexedDbSchemas({
  6: {
    schema: "&id, prompt, createdAt",
    rowValidationSchema: PromptHistorySchema,
  },
});
