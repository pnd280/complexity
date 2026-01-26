import { z } from "zod";

import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";
import threadRawHeadingsCss from "@/plugins/_thread/raw-headings/styles.css?inline";

export const threadRawHeadingsCssResourceConfig = defineVersionedRemoteResource(
  {
    name: "plugin.threadRawHeadings.css",
    type: "css",
    fallback: threadRawHeadingsCss,
    zodSchema: z.string(),
  },
);
