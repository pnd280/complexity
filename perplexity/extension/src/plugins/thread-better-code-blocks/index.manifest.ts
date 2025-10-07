import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";
import {
  BetterCodeBlockGlobalOptionsSchema,
  BetterCodeBlockFineGrainedOptionsSchema,
  type BetterCodeBlockFineGrainedOptions,
} from "@/plugins/thread-better-code-blocks/types";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "thread:betterCodeBlocks": z.infer<typeof schema>;
  }

  interface PluginsIndexedDbRegistry {
    "thread:betterCodeBlocks": BetterCodeBlockFineGrainedOptions;
  }

  interface PluginsDbDataRegistry {
    "thread:betterCodeBlocks": BetterCodeBlockFineGrainedOptions[];
  }
}

const schema = z
  .object({
    enabled: z.boolean(),
  })
  .extend(BetterCodeBlockGlobalOptionsSchema.shape);

export default definePlugin({
  meta: {
    id: "thread:betterCodeBlocks",
    title: "Better Code Blocks",
    description: "Enhance code blocks (in threads)",
    dashboardMeta: {
      tags: ["ui", "highPerfImpact", "cometAssistant"],
      categories: ["thread"],
      uiRouteSegment: "thread-better-code-blocks",
    },
    dependencies: {
      corePlugins: ["spaRouter", "domObservers:thread:codeBlocks"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      stickyHeader: true,
      showLineNumbers: false,
      unwrap: {
        enabled: true,
        showToggleButton: true,
      },
      maxHeight: {
        enabled: true,
        collapseByDefault: false,
        value: 500,
        showToggleButton: true,
      },
      maxWidth: {
        enabled: false,
        value: 100,
      },
    },
  },
  indexedDb: {
    versions: [
      {
        version: 6,
        tableName: "betterCodeBlocks",
        schema: "&language",
      },
      {
        version: 8,
        tableName: "thread:betterCodeBlocks",
        schema: "&language",
        upgrade: async (tx) => {
          const oldTable = tx.table("betterCodeBlocks");

          const newTable = tx.table("thread:betterCodeBlocks");

          const oldData = await oldTable.toArray();

          for (const record of oldData) {
            const migratedRecord = {
              ...record,
              maxWidth: {
                enabled: false,
                value: 100,
              },
            };

            await newTable.add(migratedRecord);
          }

          console.log(
            `Migrated ${oldData.length} records from betterCodeBlocks to thread:betterCodeBlocks`,
          );
        },
      },
    ],
    schema: BetterCodeBlockFineGrainedOptionsSchema,
  },
});
