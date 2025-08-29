import { z } from "zod";

import hideGetMobileAppCtaBtnCss from "@/plugins/hide-get-mobile-app-cta-btn/styles.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const hideGetMobileAppCtaBtnCssResourceConfig =
  defineVersionedRemoteResource({
    name: "plugin.hideGetMobileAppCtaBtn.css",
    type: "css",
    fallback: hideGetMobileAppCtaBtnCss,
    zodSchema: z.string(),
  });
