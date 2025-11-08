import { z } from "zod";

import threadCustomContainerWidthCss from "@/plugins/thread-custom-container-width/styles.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const threadCustomContainerWidthCssResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.threadCustomContainerWidth.css",
    type: "css",
    fallback: threadCustomContainerWidthCss,
    zodSchema: z.string(),
  });
