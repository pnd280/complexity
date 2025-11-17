import { z } from "zod";

import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";
import hideNativeDropdownsCss from "@/plugins/_thread/better-rewrite-dropdown/hide-native-rewrite-dropdowns.css?inline";

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
      name: "DropdownMenu",
      dataNodePath: [
        "memoizedProps",
        "children",
        "1",
        "props",
        "children",
        "props",
        "children",
        "props",
        "children",
        "props",
        "children",
        "props",
        "footer",
        "props",
        "onClickRewrite",
      ],
    },
    zodSchema: z.object({
      name: z.string(),
      dataNodePath: z.array(z.string()),
    }),
  });
