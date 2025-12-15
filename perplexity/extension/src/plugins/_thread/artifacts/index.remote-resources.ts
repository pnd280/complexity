import { z } from "zod";

import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";
import normalizeCss from "@/plugins/_thread/artifacts/styles.css?inline";

export const normalizeCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.artifacts.normalizeCss",
  type: "css",
  fallback: normalizeCss,
  zodSchema: z.string(),
});
