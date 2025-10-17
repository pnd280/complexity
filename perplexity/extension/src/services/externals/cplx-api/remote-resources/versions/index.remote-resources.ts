/* cli-ignore */

import type z from "zod";

import { APP_CONFIG } from "@/app.config";
import { defineRemoteResource } from "@/services/externals/cplx-api/remote-resources";
import {
  CplxVersionsSchema,
  type CplxVersions,
} from "@/services/externals/cplx-api/types";

export const versionsRemoteResourceConfig = defineRemoteResource({
  resourcePath: "versions.json",
  type: "json",
  fallback: {
    latest: APP_CONFIG.VERSION,
  },
  zodSchema: CplxVersionsSchema as z.ZodType<CplxVersions>,
});
