/* cli-ignore */

import z from "zod";

import { APP_CONFIG } from "@/app.config";
import { defineRemoteResource } from "@/services/externals/cplx-api/remote-resources";

export const cometAffiliateRemoteResourceConfig = defineRemoteResource({
  resourcePath: "comet-affiliate.json",
  type: "json",
  fallback: {
    enabled: APP_CONFIG.IS_DEV,
    link: "pplx.ai/paradroid",
  },
  zodSchema: z.object({
    enabled: z.boolean(),
    link: z.string(),
  }),
});
