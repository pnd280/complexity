import semver from "semver";
import { z } from "zod";

import { APP_CONFIG } from "@/app.config";

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

export const ChangelogListingSchema = z.record(SemverSchema, z.string());

export type ChangelogListing = z.infer<typeof ChangelogListingSchema>;
