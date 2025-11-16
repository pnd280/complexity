import { z } from "zod";

import queryBoxFollowUpQueryBoxNormalizeCss from "@/plugins/__ui-groups__/elements/query-box/follow-up/styles.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const queryBoxFollowUpQueryBoxNormalizeCssResourceConfig =
  defineVersionedRemoteResource({
    name: "uiGroups.queryBox.followUpQueryBoxNormalizeCss",
    type: "css",
    fallback: queryBoxFollowUpQueryBoxNormalizeCss,
    zodSchema: z.string(),
  });
