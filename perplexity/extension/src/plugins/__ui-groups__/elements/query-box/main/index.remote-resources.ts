import { z } from "zod";

import queryBoxMainQueryBoxNormalizeCss from "@/plugins/__ui-groups__/elements/query-box/main/styles.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const queryBoxMainQueryBoxNormalizeCssResourceConfig =
  defineVersionedRemoteResource({
    name: "uiGroups.queryBox.mainQueryBoxNormalizeCss",
    type: "css",
    fallback: queryBoxMainQueryBoxNormalizeCss,
    zodSchema: z.string(),
  });
