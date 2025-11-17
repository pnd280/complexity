import { z } from "zod";

import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";
import normalizeCss from "@/plugins/force-writing-mode/styles.css?inline";

export const normalizeCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.forceWritingMode.normalizeCss",
  type: "css",
  fallback: normalizeCss,
  zodSchema: z.string(),
});
