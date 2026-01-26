import { z } from "zod";

import { defineVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources";
import homeCustomSloganCss from "@/plugins/home-custom-slogan/styles.css?inline";

export const homeCustomSloganCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.homeCustomSlogan.css",
  type: "css",
  fallback: homeCustomSloganCss,
  zodSchema: z.string(),
});
