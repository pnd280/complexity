import type { TranslationShape } from "@complexity/i18n";

import type translations from "@/plugins/cloudflare-timeout-auto-reload/_locales/en-US";

export const namespace = "plugin-cloudflare-timeout-auto-reload";

export type Translations = TranslationShape<typeof translations>;

declare module "@complexity/i18n" {
  interface TranslationsRegistry {
    [namespace]: typeof translations;
  }
}
