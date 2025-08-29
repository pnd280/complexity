import { z } from "zod";

import homeCustomSloganCss from "@/plugins/home-custom-slogan/styles.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const homeCustomSloganCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.homeCustomSlogan.css",
  type: "css",
  fallback: homeCustomSloganCss,
  zodSchema: z.string(),
});
