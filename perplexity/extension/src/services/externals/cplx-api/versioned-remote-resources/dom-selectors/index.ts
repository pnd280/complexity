// ⚠️⚠️⚠️ This service is used in both main world and extension's context
// ⚠️⚠️⚠️ Keep this service clean from any extension-only lib

import {
  DOM_SELECTORS,
  INTERNAL_ATTRIBUTES,
  TEST_ID,
} from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/defaults";
import { type DomSelectors } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/types";
import { errorWrapper } from "@/utils/error-wrapper";
import { invariant } from "@/utils/utils";

export class DomSelectorsService {
  static local: DomSelectors = DOM_SELECTORS;

  static remote: DomSelectors | null = null;

  static internalAttributes = INTERNAL_ATTRIBUTES;

  static testIds = TEST_ID;

  static get cachedSync() {
    invariant(
      isExtensionContext(),
      "This method is only available in content script, use mainWorldGet instead.",
    );

    return DomSelectorsService.remote ?? DomSelectorsService.local;
  }

  static async mainWorldCached() {
    invariant(
      isMainWorldContext(),
      "This method is only available in main world.",
    );

    if (DomSelectorsService.remote != null) return DomSelectorsService.remote;

    const sendMessage = (await import("webext-bridge/window")).sendMessage;

    const [remoteDomSelectors, error] = await errorWrapper(() =>
      sendMessage("cache:domSelectors", undefined, "content-script"),
    )();

    if (error) {
      return DomSelectorsService.local;
    }

    DomSelectorsService.remote = remoteDomSelectors;

    return remoteDomSelectors;
  }

  static cplxAttribute(attribute: string): `[data-cplx-component="${string}"]` {
    return `[data-cplx-component="${attribute}"]`;
  }
}
