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
  ),
  getVersionedRemoteResource(internalSearchStatesStatesFiberPathResourceConfig),
]);
