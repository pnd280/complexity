import { z } from "zod";

import threadRawHeadingsCss from "@/plugins/thread-raw-headings/styles.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const threadRawHeadingsCssResourceConfig = defineVersionedRemoteResource(
  {
    name: "plugin.threadRawHeadings.css",
    type: "css",
    fallback: threadRawHeadingsCss,
    zodSchema: z.string(),
  },
);
