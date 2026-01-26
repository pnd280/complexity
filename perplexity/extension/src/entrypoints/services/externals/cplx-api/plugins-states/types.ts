import { z } from "zod";

import { SemverSchema } from "@/entrypoints/services/externals/cplx-api/types";
import type { PluginId } from "@/entrypoints/services/plugins/types";

export type PluginsEnableStates = Record<PluginId, boolean>;

export const FeatureCompatibilitySchema = z.record(
  z.custom<PluginId>((val) => typeof val === "string"),
  SemverSchema,
);

export type FeatureCompatibility = z.infer<typeof FeatureCompatibilitySchema>;
