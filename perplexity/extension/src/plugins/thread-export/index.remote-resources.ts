import { z } from "zod";

import hideOpenInAppBtnCss from "@/plugins/thread-export/hide-open-in-app-btn.css?inline";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const hideOpenInAppBtnCssResourceConfig = defineVersionedRemoteResource({
  name: "plugin.exportThread.hideOpenInAppBtnCss",
  type: "css",
  fallback: hideOpenInAppBtnCss,
  zodSchema: z.string(),
});
