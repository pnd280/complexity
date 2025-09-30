import { z } from "zod";

import queryBoxFollowUpQueryBoxNormalizeCss from "@/plugins/__ui-groups__/elements/query-box/follow-up/follow-up-query-box.css?inline";
import queryBoxMainQueryBoxNormalizeCss from "@/plugins/__ui-groups__/elements/query-box/main/main-query-box.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const queryBoxMainQueryBoxNormalizeCssResourceConfig =
  defineVersionedRemoteResource({
    name: "uiGroups.queryBox.mainQueryBoxNormalizeCss",
    type: "css",
    fallback: queryBoxMainQueryBoxNormalizeCss,
    zodSchema: z.string(),
  });

export const queryBoxFollowUpQueryBoxNormalizeCssResourceConfig =
  defineVersionedRemoteResource({
    name: "uiGroups.queryBox.followUpQueryBoxNormalizeCss",
    type: "css",
    fallback: queryBoxFollowUpQueryBoxNormalizeCss,
    zodSchema: z.string(),
  });
