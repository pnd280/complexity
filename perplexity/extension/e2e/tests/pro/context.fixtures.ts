import type { BrowserContext, Page } from "@playwright/test";
import { test as baseTest } from "@playwright/test";

import { E2E_CONFIG } from "~/e2e/config";
import { cookies } from "~/e2e/tests/pro/cookies";
import { setupBrowser } from "~/e2e/utils/browser-setup";

type TestFixtures = {
  context: BrowserContext;
  page: Page;
};

type TestOptions = {
  headless: boolean;
};

export const test = baseTest.extend<TestFixtures, TestOptions>({
  headless: [E2E_CONFIG.HEADLESS, { scope: "worker" }],
  context: async ({ headless }, use) => {
    const context: BrowserContext = await setupBrowser({
      headless,
      cookies,
    });
    await use(context);
    await context.close();
  },
});
