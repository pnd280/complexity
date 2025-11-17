import { expect } from "@playwright/test";

import { pplxLocalLanguageModels } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/defaults";
import { TEST_ID } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/dom-selectors/defaults";
import { HomePage } from "~/e2e/pages/home.page";
import { test } from "~/e2e/tests/pro/context.fixtures";

test.describe.skip("Query box", () => {
  test.describe("Language model selector", () => {
    test("should show language model selector", async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.load();

      const languageModelSelector = page.locator(
        `[data-testid="${TEST_ID.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}"]`,
      );

      await expect(languageModelSelector).toBeVisible();
    });

    test("should select language model", async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.load();

      const languageModelSelector = page.locator(
        `[data-testid="${TEST_ID.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}"]`,
      );

      await languageModelSelector.click();

      const claudeOption = page
        .locator(`text=${pplxLocalLanguageModels.search[1].label}`)
        .first();
      await claudeOption.click();
    });
  });
});
