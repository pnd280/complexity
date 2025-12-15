import { definePluginIndexedDbSchemas } from "@/entrypoints/services/plugins/defines";
import { BetterCodeBlockFineGrainedOptionsSchema } from "@/plugins/_thread/better-code-blocks/types";

export const indexedDbSchemas = definePluginIndexedDbSchemas({
  8: {
    schema: "&language",
    rowValidationSchema: BetterCodeBlockFineGrainedOptionsSchema,
  },
});
