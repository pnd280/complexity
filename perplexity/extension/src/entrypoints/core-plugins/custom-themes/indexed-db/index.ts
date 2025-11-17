import z from "zod";

import { legacyThemeMigration } from "@/entrypoints/core-plugins/custom-themes/themes/migration";
import { definePluginIndexedDbSchemas } from "@/entrypoints/services/plugins/defines";

export const indexedDbSchemas = definePluginIndexedDbSchemas({
  6: {
    schema: "&id, title, author",
    rowValidationSchema: z.object({
      id: z.string(),
      title: z.string(),
      author: z.string(),
    }),
  },
  7: {
    upgrade: (tx) => {
      void tx.table("themes").toCollection().modify(legacyThemeMigration);
    },
  },
});
