import { z } from "zod";

import queryBoxMainQueryBoxNormalizeCss from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/main/styles.css?inline";
import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";

export const queryBoxMainQueryBoxNormalizeCssResourceConfig =
  defineVersionedRemoteResource({
    name: "uiGroups.queryBox.mainQueryBoxNormalizeCss",
    type: "css",
    fallback: queryBoxMainQueryBoxNormalizeCss,
    zodSchema: z.string(),
  });
