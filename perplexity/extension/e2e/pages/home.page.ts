import { expect } from "@playwright/test";

import { DOM_SELECTORS } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/dom-selectors/defaults";
import { ENDPOINTS } from "@/entrypoints/services/externals/pplx-api/endpoints";
import { E2E_CONFIG } from "~/e2e/config";
import { BasePage } from "~/e2e/pages/_base.page";

export class HomePage extends BasePage {
  async load(): Promise<void> {
    await this.navigateTo(ENDPOINTS.HOME);
    await expect(this.page).toHaveTitle(/Perplexity/);
  }

  async verifyKeyElements(): Promise<void> {
    const heading = this.page.locator(DOM_SELECTORS.HOME.SLOGAN);
    await expect(heading).toBeVisible({
      timeout: E2E_CONFIG.TIMEOUTS.HEADING_VISIBLE * 100,
    });
  }

  async verifyHomepageLoad(): Promise<void> {
    await this.verifyKeyElements();
  }
}
