import { remoteResourceTypes } from "@/entrypoints/services/externals/cplx-api/types";
import { type VersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/types";
import { invariant } from "@/utils/misc/utils";

export function defineVersionedRemoteResource<T>(
  resourceConfig: VersionedRemoteResource<T>,
): VersionedRemoteResource<T> & {
  isVersioned: true;
} {
  invariant(
    remoteResourceTypes.includes(resourceConfig.type),
    "Invalid resource type",
  );
  return {
    ...resourceConfig,
    isVersioned: true,
  };
}
