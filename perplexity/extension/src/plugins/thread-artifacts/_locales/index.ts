import type { TranslationShape } from "@complexity/i18n";

import type translations from "@/plugins/thread-artifacts/_locales/plugin-artifacts.en-US";

export const namespace = "plugin-artifacts";

export type Translations = TranslationShape<typeof translations>;

declare module "@complexity/i18n" {
  interface TranslationsRegistry {
    [namespace]: typeof translations;
  }
}
