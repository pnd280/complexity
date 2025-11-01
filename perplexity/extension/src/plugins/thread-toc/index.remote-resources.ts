import { z } from "zod";

import threadTocCss from "@/plugins/thread-toc/styles.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const threadTocCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.threadToc.css",
  type: "css",
  fallback: threadTocCss,
  zodSchema: z.string(),
});
