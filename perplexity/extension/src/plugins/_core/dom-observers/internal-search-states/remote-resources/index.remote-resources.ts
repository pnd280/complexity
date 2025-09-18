import { z } from "zod";

import {
  localInternalSearchStatesStatesFiberPath,
  localInternalSearchStatesValidateFiberPath,
} from "@/plugins/_core/dom-observers/internal-search-states/remote-resources/fallback";
import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";

export const internalSearchStatesValidateFiberPathResourceConfig =
  defineVersionedRemoteResource({
    name: "internal-search-states-validate-fiber-node-path",
    type: "txt",
    fallback: localInternalSearchStatesValidateFiberPath.join("."),
    zodSchema: z.string(),
  });

export const internalSearchStatesStatesFiberPathResourceConfig =
  defineVersionedRemoteResource({
    name: "internal-search-states-states-fiber-node-path",
    type: "txt",
    fallback: localInternalSearchStatesStatesFiberPath.join("."),
    zodSchema: z.string(),
  });
