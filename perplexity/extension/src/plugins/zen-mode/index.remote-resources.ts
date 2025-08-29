import { z } from "zod";

import alwaysHideRelatedQuestionsCss from "@/plugins/zen-mode/always-hide-related-questions.css?inline";
import zenModeCss from "@/plugins/zen-mode/zen-mode.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const zenModeCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.zenMode.zenModeCss",
  type: "css",
  fallback: zenModeCss,
  zodSchema: z.string(),
});

export const alwaysHideRelatedQuestionsCssResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.zenMode.alwaysHideRelatedQuestionsCss",
    type: "css",
    fallback: alwaysHideRelatedQuestionsCss,
    zodSchema: z.string(),
  });
