import { z } from "zod";

import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";
import hideNativeCopyButtonsCss from "@/plugins/_thread/better-message-copy-buttons/hide-native-buttons.css?inline";

export const hideNativeCopyButtonsCssResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.threadBetterMessageCopyButtons.hideNativeCopyButtonsCss",
    type: "css",
    fallback: hideNativeCopyButtonsCss,
    zodSchema: z.string(),
  });
