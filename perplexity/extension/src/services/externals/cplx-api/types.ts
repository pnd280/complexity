import semver from "semver";
import { z, type ZodSchema } from "zod";

import { APP_CONFIG } from "@/app.config";
import type { PluginId } from "@/data/plugin-registry/types";

export const remoteResourceTypes = ["css", "txt", "json"] as const;

export type RemoteResourceType = (typeof remoteResourceTypes)[number];

export const SemverSchema = z
  .string()
  .refine(
    (v) =>
      !!semver.valid(
        semver.coerce(v, {
          includePrerelease: true,
        }),
      ),
    {
      error: "Invalid semver",
    },
  )
  .transform((v) => semver.coerce(v, { includePrerelease: true })!.toString());

export const CplxVersionsApiResponseSchema = z.object({
  latest: SemverSchema,
  latestFirefox: SemverSchema,
});

export type CplxVersionsApiResponse = z.infer<
  typeof CplxVersionsApiResponseSchema
>;

export const CplxVersionsSchema = CplxVersionsApiResponseSchema.transform(
  (data) => {
    const latest = APP_CONFIG.BROWSER === "chrome" ? "latest" : "latestFirefox";

    return {
      latest: data[latest],
    };
  },
);

export type CplxVersions = z.infer<typeof CplxVersionsSchema>;

export const FeatureCompatibilitySchema = z.record(
  z.custom<PluginId>((val) => typeof val === "string"),
  SemverSchema,
);

export type FeatureCompatibility = z.infer<typeof FeatureCompatibilitySchema>;

export const ChangelogListingSchema = z.record(SemverSchema, z.string());

export type ChangelogListing = z.infer<typeof ChangelogListingSchema>;

export interface ICplxApiService {
  fetchChangelog(options?: { version?: string }): Promise<string>;

  fetchChangelogListing(): Promise<ChangelogListing>;

  fetchRemoteResource<T>(params: {
    resourcePath: string;
    zodSchema: ZodSchema<T>;
  }): Promise<T>;

  fetchVersionedRemoteResource<T>(params: {
    resourcePath: string;
    zodSchema: ZodSchema<T>;
  }): Promise<T>;

  fetchSoftCacheBuster(): Promise<string>;

  fetchPsa(): Promise<string>;
}
