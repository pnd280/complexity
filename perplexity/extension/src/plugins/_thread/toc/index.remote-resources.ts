import { z } from "zod";

import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";
import threadTocCss from "@/plugins/_thread/toc/styles.css?inline";

export const threadTocCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.threadToc.css",
  type: "css",
  fallback: threadTocCss,
  zodSchema: z.string(),
});
