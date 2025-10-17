import { z } from "zod";

import { type RemoteResourceType } from "@/services/externals/cplx-api/types";

export type VersionedRemoteResource<T> = {
  name: string;
  type: RemoteResourceType;
  fallback: T;
  zodSchema: z.ZodType<T>;
};

export type VersionedRemoteResourceReturnType<T> =
  VersionedRemoteResource<T> & {
    isVersioned: true;
  };

export const VersionedRemoteResourceListingSchema = z.record(
  z.string(),
  z.record(z.string(), z.string()),
);

export type VersionedRemoteResourceListing = z.infer<
  typeof VersionedRemoteResourceListingSchema
>;
