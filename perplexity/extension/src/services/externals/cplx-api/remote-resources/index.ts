import type { RemoteResource } from "@/services/externals/cplx-api/remote-resources/types";
import { remoteResourceTypes } from "@/services/externals/cplx-api/types";
import { invariant } from "@/utils/misc/utils";

export function defineRemoteResource<T>(
  resourceConfig: RemoteResource<T>,
): RemoteResource<T> {
  invariant(
    remoteResourceTypes.includes(resourceConfig.type),
    "Invalid resource type",
  );
  return resourceConfig;
}
