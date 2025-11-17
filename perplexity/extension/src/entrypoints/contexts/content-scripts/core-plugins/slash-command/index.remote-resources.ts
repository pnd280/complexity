import { z } from "zod";

import slashCommandMenuCss from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/styles.css?inline";
import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";

export const slashCommandMenuCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.slashCommandMenu.slashCommandMenuCss",
  type: "css",
  fallback: slashCommandMenuCss,
  zodSchema: z.string(),
});
