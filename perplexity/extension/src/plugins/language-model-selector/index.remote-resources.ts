import { z } from "zod";

import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";
import hideNativeModelSelectorCss from "@/plugins/language-model-selector/hide-native-model-selector.css?inline";

export const hideNativeModelSelectorCssResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.languageModelSelector.hideNativeModelSelectorCss",
    type: "css",
    fallback: hideNativeModelSelectorCss,
    zodSchema: z.string(),
  });
