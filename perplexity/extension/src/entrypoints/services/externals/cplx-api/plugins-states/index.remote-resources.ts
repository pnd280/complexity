/* cli-ignore */

import { APP_CONFIG } from "@/app.config";
import {
  FeatureCompatibilitySchema,
  type FeatureCompatibility,
} from "@/entrypoints/services/externals/cplx-api/plugins-states/types";
import { defineRemoteResource } from "@/entrypoints/services/externals/cplx-api/remote-resources";
import { getPluginIds } from "@/entrypoints/services/plugins/utils";

export const featureCompatResourceConfig = defineRemoteResource({
  resourcePath: "feature-compat.json",
  type: "json",
  fallback: Object.fromEntries(
    getPluginIds().map((id) => [id, APP_CONFIG.VERSION]),
  ) as FeatureCompatibility,
  zodSchema: FeatureCompatibilitySchema,
});
