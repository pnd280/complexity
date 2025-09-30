/* cli-ignore */

import { APP_CONFIG } from "@/app.config";
import { PluginManifestsRegistry } from "@/data/registries/plugins";
import { defineRemoteResource } from "@/services/externals/cplx-api/remote-resources";
import {
  FeatureCompatibilitySchema,
  type FeatureCompatibility,
} from "@/services/externals/cplx-api/types";

export const featureCompatResourceConfig = defineRemoteResource({
  resourcePath: "feature-compat.json",
  type: "json",
  fallback: Object.fromEntries(
    Object.keys(PluginManifestsRegistry.meta).map((key) => [
      key,
      APP_CONFIG.VERSION,
    ]),
  ) as FeatureCompatibility,
  zodSchema: FeatureCompatibilitySchema,
});
