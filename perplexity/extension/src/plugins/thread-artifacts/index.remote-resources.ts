import { z } from "zod";

import normalizeCss from "@/plugins/thread-artifacts/styles.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const normalizeCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.artifacts.normalizeCss",
  type: "css",
  fallback: normalizeCss,
  zodSchema: z.string(),
});
