import { z } from "zod";

import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";
import normalizeCollapsedCss from "@/plugins/better-sidebar/assets/collapsed.css?inline";
import normalizeExpandedCss from "@/plugins/better-sidebar/assets/expanded.css?inline";
import normalizeCss from "@/plugins/better-sidebar/assets/styles.css?inline";

export const betterSidebarNormalizeCssResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.betterSidebar.normalizeCss",
    type: "css",
    fallback: normalizeCss,
    zodSchema: z.string(),
  });

export const betterSidebarNormalizeCollapsedCssResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.betterSidebar.normalizeCollapsedCss",
    type: "css",
    fallback: normalizeCollapsedCss,
    zodSchema: z.string(),
  });

export const betterSidebarNormalizeExpandedCssResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.betterSidebar.normalizeExpandedCss",
    type: "css",
    fallback: normalizeExpandedCss,
    zodSchema: z.string(),
  });
