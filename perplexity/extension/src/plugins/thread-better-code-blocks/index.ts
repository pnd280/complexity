import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";
import { BetterCodeBlockGlobalOptionsSchema } from "@/plugins/thread-better-code-blocks/types";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:betterCodeBlocks": z.infer<typeof schema>;
  }
}

const schema = z
  .object({
    enabled: z.boolean(),
  })
  .extend(BetterCodeBlockGlobalOptionsSchema.shape);

export default definePlugin({
  manifest: {
    id: "thread:betterCodeBlocks",
    settingsUiRouteSegment: "thread-better-code-blocks",
    title: "Better Code Blocks",
    description: "Enhance code blocks (in threads)",
    categories: ["thread", "comet"],
    tags: ["ui", "highPerfImpact", "cometAssistant"],
    dependentDomObservers: ["thread:codeBlocks"],
    dependentMainWorldCorePlugins: ["spaRouter", "reactVdom"],
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
    },
  },
});
