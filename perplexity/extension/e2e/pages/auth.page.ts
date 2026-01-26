import { expect } from "@playwright/test";

import { BasePage } from "~/e2e/pages/_base.page";
import { fetchPplxAuthSession } from "~/e2e/utils/pplx-api";
import type { AuthSession } from "~/e2e/utils/pplx-api";

export class AuthPage extends BasePage {
  async verifyIsLoggedIn(isPro: boolean): Promise<void> {
    const authSession = await this.fetchPplxAuthSession();

    console.log(authSession);

    expect(authSession.user.id).not.toBeNull();

    if (isPro) {
      expect(authSession.user.subscription_status).not.toBe("none");
    } else {
      expect(authSession.user.subscription_status).toBe("none");
    }
  }

  private async fetchPplxAuthSession(): Promise<AuthSession> {
    return await fetchPplxAuthSession(this.page);
  }
}
