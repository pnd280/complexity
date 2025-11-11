import { z } from "zod";

import slashCommandMenuCss from "@/plugins/__core__/slash-command/styles.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const slashCommandMenuCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.slashCommandMenu.slashCommandMenuCss",
  type: "css",
  fallback: slashCommandMenuCss,
  zodSchema: z.string(),
});
