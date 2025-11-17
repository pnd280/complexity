import { z } from "zod";

import queryBoxFollowUpQueryBoxNormalizeCss from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/follow-up/styles.css?inline";
import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";

export const queryBoxFollowUpQueryBoxNormalizeCssResourceConfig =
  defineVersionedRemoteResource({
    name: "uiGroups.queryBox.followUpQueryBoxNormalizeCss",
    type: "css",
    fallback: queryBoxFollowUpQueryBoxNormalizeCss,
    zodSchema: z.string(),
  });
