import type { Page } from "@playwright/test";

import { ENDPOINTS } from "@/entrypoints/services/externals/pplx-api/endpoints";
import { PplxUserSettingsApiResponseSchema } from "@/entrypoints/services/externals/pplx-api/pplx-api.types";

export type AuthSession = {
  user: {
    name: string;
    email: string;
    image: string;
    id: string;
    username: string;
    subscription_status: string;
    subscription_source: string;
  };
  expires: string;
  preventUsernameRedirect: boolean;
};

export async function fetchPplxAuthSession(page: Page) {
  const resp = await page.request.get(ENDPOINTS.AUTH_SESSION);
  return (await resp.json()) as AuthSession;
}

export async function fetchPplxUserSettings(page: Page) {
  const resp = await page.request.get(ENDPOINTS.USER_SETTINGS.INDEX);
  return PplxUserSettingsApiResponseSchema.parse(await resp.json());
}
