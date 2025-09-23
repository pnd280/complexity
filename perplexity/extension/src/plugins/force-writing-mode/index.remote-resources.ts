import { z } from "zod";

import normalizeCss from "@/plugins/force-writing-mode/styles.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const normalizeCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.forceWritingMode.normalizeCss",
  type: "css",
  fallback: normalizeCss,
  zodSchema: z.string(),
});
