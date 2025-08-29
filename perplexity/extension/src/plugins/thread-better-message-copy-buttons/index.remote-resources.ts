import { z } from "zod";

import hideNativeCopyButtonsCss from "@/plugins/thread-better-message-copy-buttons/hide-native-buttons.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const hideNativeCopyButtonsCssResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.threadBetterMessageCopyButtons.hideNativeCopyButtonsCss",
    type: "css",
    fallback: hideNativeCopyButtonsCss,
    zodSchema: z.string(),
  });
