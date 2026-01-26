import { z } from "zod";

import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";
import threadCustomContainerWidthCss from "@/plugins/_thread/custom-container-width/styles.css?inline";

export const threadCustomContainerWidthCssResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.threadCustomContainerWidth.css",
    type: "css",
    fallback: threadCustomContainerWidthCss,
    zodSchema: z.string(),
  });
