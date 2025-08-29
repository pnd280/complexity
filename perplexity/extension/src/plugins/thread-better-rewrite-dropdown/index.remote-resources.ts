import { z } from "zod";

import hideNativeDropdownsCss from "@/plugins/thread-better-rewrite-dropdown/hide-native-rewrite-dropdowns.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const threadBetterRewriteDropdownHideNativeDropdownsCssResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.threadBetterRewriteDropdown.hideNativeDropdownsCss",
    type: "css",
    fallback: hideNativeDropdownsCss,
    zodSchema: z.string(),
  });
