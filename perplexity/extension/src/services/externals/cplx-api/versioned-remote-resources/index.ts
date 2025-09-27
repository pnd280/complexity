import { remoteResourceTypes } from "@/services/externals/cplx-api/types";
import {
  type VersionedRemoteResource,
  type VersionedRemoteResourceReturnType,
} from "@/services/externals/cplx-api/versioned-remote-resources/types";
import { invariant } from "@/utils/misc/utils";

export function defineVersionedRemoteResource<T>(
  resourceConfig: VersionedRemoteResource<T>,
): VersionedRemoteResourceReturnType<T> {
  invariant(
    remoteResourceTypes.includes(resourceConfig.type),
    "Invalid resource type",
  );
  return {
    ...resourceConfig,
    isVersioned: true,
  };
}
