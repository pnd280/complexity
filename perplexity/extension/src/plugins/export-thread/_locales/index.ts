import type { TranslationShape } from "@complexity/i18n";

import type translations from "@/plugins/export-thread/_locales/plugin-export-thread.en-US";

export const namespace = "plugin-export-thread";

export type Translations = TranslationShape<typeof translations>;

declare module "@complexity/i18n" {
  interface TranslationsRegistry {
    [namespace]: typeof translations;
  }
}
