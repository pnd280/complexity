import type { Page } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "networkidle" });
  }
}
