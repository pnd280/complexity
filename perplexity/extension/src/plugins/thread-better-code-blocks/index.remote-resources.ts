import { z } from "zod";

import hideNativeCodeBlocksCss from "@/plugins/thread-better-code-blocks/hide-native-code-blocks.css?inline";
import stickyHeaderCss from "@/plugins/thread-better-code-blocks/sticky-header.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const hideNativeCodeBlocksCssResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.threadBetterCodeBlocks.hideNativeCodeBlocksCss",
    type: "css",
    fallback: hideNativeCodeBlocksCss,
    zodSchema: z.string(),
  });

export const stickyHeaderCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.threadBetterCodeBlocks.stickyHeaderCss",
  type: "css",
  fallback: stickyHeaderCss,
  zodSchema: z.string(),
});
