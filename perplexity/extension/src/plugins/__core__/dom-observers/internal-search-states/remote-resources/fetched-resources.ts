import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import {
  internalSearchStatesStatesFiberPathResourceConfig,
  internalSearchStatesValidateFiberPathResourceConfig,
} from "@/plugins/__core__/dom-observers/internal-search-states/remote-resources/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

export const [
  remoteInternalSearchStatesValidateFiberPathStr,
  remoteInternalSearchStatesStatesFiberPathStr,
] = await Promise.all([
  getVersionedRemoteResource(
    internalSearchStatesValidateFiberPathResourceConfig,
    persistentQueryClient,
  ),
  getVersionedRemoteResource(
    internalSearchStatesStatesFiberPathResourceConfig,
    persistentQueryClient,
  ),
]);
