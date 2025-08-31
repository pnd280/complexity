// ⚠️⚠️⚠️ This service is used in both main world and extension's context
// ⚠️⚠️⚠️ Keep this service clean from any extension-only lib

import {
  DOM_SELECTORS,
  INTERNAL_ATTRIBUTES,
  TEST_ID,
} from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/defaults";
import { type DomSelectors } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/types";
import { invariant } from "@/utils/utils";

export const csProxyServiceName = "domSelectorsService";

export class DomSelectorsService {
  static local: DomSelectors = DOM_SELECTORS;

  static remote: DomSelectors | null = null;

  static internalAttributes = INTERNAL_ATTRIBUTES;

  static testIds = TEST_ID;

  static getCache() {
    return DomSelectorsService.remote ?? DomSelectorsService.local;
  }

  static get cachedSync() {
    invariant(
      isExtensionContext(),
      "This method is only available in content script, use getCache instead.",
    );

    return DomSelectorsService.getCache();
  }

  static cplxAttribute(attribute: string): `[data-cplx-component="${string}"]` {
    return `[data-cplx-component="${attribute}"]`;
  }
}
