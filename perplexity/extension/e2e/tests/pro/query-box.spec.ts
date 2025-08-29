import { expect } from "@playwright/test";

import { PplxLanguageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-language-models";
import { DomSelectorsService } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { HomePage } from "~/e2e/pages/home.page";
import { test } from "~/e2e/tests/pro/context.fixtures";

test.describe("Query box", () => {
  test.describe("Language model selector", () => {
    test("should show language model selector", async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.load();

      const languageModelSelector = page.locator(
        `[data-testid="${DomSelectorsService.testIds.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}"]`,
      );

      await expect(languageModelSelector).toBeVisible();
    });

    test("should show language model selector options", async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.load();

      const languageModelSelector = page.locator(
        `[data-testid="${DomSelectorsService.testIds.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}"]`,
      );

      await languageModelSelector.click();

      const anthropicOption = page.locator("text=Anthropic");
      await expect(anthropicOption).toBeVisible();
    });

    test("should select language model", async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.load();

      const languageModelSelector = page.locator(
        `[data-testid="${DomSelectorsService.testIds.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}"]`,
      );

      await languageModelSelector.click();

      const claudeOption = page
        .locator(
          `text=${PplxLanguageModelsService.allModels?.search?.[1]?.label}`,
        )
        .first();
      await claudeOption.click();
    });
  });
});
