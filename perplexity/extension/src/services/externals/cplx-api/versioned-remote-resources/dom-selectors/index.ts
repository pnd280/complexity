// ⚠️⚠️⚠️ This service is used in both main world and extension's context
// ⚠️⚠️⚠️ Keep this service clean from any extension-only lib

import {
  DOM_SELECTORS,
  INTERNAL_ATTRIBUTES,
  TEST_ID,
} from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/defaults";
import type { DomSelectors } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/types";
import { invariant } from "@/utils/misc/utils";

export const csProxyServiceName = "domSelectorsService";

export class DomSelectorsServiceImpl {
  static local: typeof DOM_SELECTORS = DOM_SELECTORS;

  static remote: typeof DOM_SELECTORS | DomSelectors | null = null;

  static internalAttributes = INTERNAL_ATTRIBUTES;

  static testIds = TEST_ID;

  static getCache(): typeof DOM_SELECTORS {
    return (DomSelectorsServiceImpl.remote ??
      DomSelectorsServiceImpl.local) as typeof DOM_SELECTORS;
  }

  static get cachedSync() {
    invariant(
      !isMainWorldContext(),
      "This method is only available in content script, use getCache instead.",
    );

    return DomSelectorsServiceImpl.getCache();
  }

  static cplxAttribute<T extends string>(
    attribute: T,
  ): `[data-cplx-component='${T}']` {
    return `[data-cplx-component="${attribute}"]` as `[data-cplx-component='${T}']`;
  }
}
export type DomSelectorsService = typeof DomSelectorsServiceImpl;
