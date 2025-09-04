/* cli-ignore */

import { APP_CONFIG } from "@/app.config";
import { PluginRegistry } from "@/data/plugin-registry";
import { defineRemoteResource } from "@/services/cplx-api/remote-resources";
import {
  FeatureCompatibilitySchema,
  type FeatureCompatibility,
} from "@/services/cplx-api/types";

export const featureCompatResourceConfig = defineRemoteResource({
  resourcePath: "feature-compat.json",
  type: "json",
  fallback: Object.fromEntries(
    Object.keys(PluginRegistry.manifests).map((key) => [
      key,
      APP_CONFIG.VERSION,
    ]),
  ) as FeatureCompatibility,
  zodSchema: FeatureCompatibilitySchema,
});
