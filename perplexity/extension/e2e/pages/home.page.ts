import { expect } from "@playwright/test";

import { DomSelectorsService } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { ENDPOINTS } from "@/services/externals/pplx-api/endpoints";
import { E2E_CONFIG } from "~/e2e/config";
import { BasePage } from "~/e2e/pages/base.page";

export class HomePage extends BasePage implements Extracted {
  async load(): Promise<void> {
    await this.navigateTo(ENDPOINTS.HOME);
    await expect(this.page).toHaveTitle(/Perplexity/);
  }

  async verifyKeyElements(): Promise<void> {
    const heading = this.page.locator(
      DomSelectorsService.cachedSync.QUERY_BOX.TEXTBOX.MAIN,
    );
    await expect(heading).toBeVisible({
      timeout: E2E_CONFIG.TIMEOUTS.HEADING_VISIBLE,
    });
  }

  async verifyHomepageLoad(): Promise<void> {
    await this.verifyKeyElements();
  }
}

interface Extracted {
  load(): Promise<void>;
  verifyKeyElements(): Promise<void>;
  verifyHomepageLoad(): Promise<void>;
}
