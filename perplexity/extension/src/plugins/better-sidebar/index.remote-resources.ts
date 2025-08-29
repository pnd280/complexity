import { z } from "zod";

import normalizeCollapsedCss from "@/plugins/better-sidebar/normalize-collapsed.css?inline";
import normalizeExpandedCss from "@/plugins/better-sidebar/normalize-expanded.css?inline";
import normalizeCss from "@/plugins/better-sidebar/normalize.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

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
