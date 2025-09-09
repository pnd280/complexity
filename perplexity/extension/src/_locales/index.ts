import type { TranslationShape } from "@complexity/i18n";

import type translations from "@/_locales/common.en-US";

export const namespace = "common";

export type Translations = TranslationShape<typeof translations>;

declare module "@complexity/i18n" {
  interface TranslationsRegistry {
    [namespace]: typeof translations;
  }
}
