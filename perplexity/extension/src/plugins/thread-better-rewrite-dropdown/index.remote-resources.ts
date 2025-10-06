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

export const threadBetterRewriteDropdownFiberConfigResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.threadBetterRewriteDropdown.fiberConfig",
    type: "json",
    fallback: {
      name: "DropDownMenu",
      dataNodePath: ["memoizedProps", "items"],
    },
    zodSchema: z.object({
      name: z.string(),
      dataNodePath: z.array(z.string()),
    }),
  });
