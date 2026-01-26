import { definePluginIndexedDbSchemas } from "@/entrypoints/services/plugins/defines";

export const indexedDbSchemas = definePluginIndexedDbSchemas(
  {
    6: {
      schema: "&key, timestamp",
    },
  },
  {
    exportable: false,
  },
);
