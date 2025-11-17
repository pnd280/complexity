import {
  internalSearchStatesStatesFiberPathResourceConfig,
  internalSearchStatesValidateFiberPathResourceConfig,
} from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/internal-search-states/remote-resources/index.remote-resources";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";

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
