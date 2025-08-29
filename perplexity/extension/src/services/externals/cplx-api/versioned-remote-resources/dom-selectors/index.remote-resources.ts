import { defineVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources";
import { DOM_SELECTORS } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/defaults";
import { DomSelectorsSchema } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/types";

export const domSelectorsResourceConfig = defineVersionedRemoteResource({
  name: "dom-selectors",
  type: "json",
  fallback: DOM_SELECTORS,
  zodSchema: DomSelectorsSchema,
});
