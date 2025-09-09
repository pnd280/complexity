import type { TranslationShape } from "@complexity/i18n";

import type translations from "@/plugins/language-model-selector/_locales/plugin-model-selectors.en-US";

export const namespace = "plugin-model-selectors";

export type Translations = TranslationShape<typeof translations>;

declare module "@complexity/i18n" {
  interface TranslationsRegistry {
    [namespace]: typeof translations;
  }
}
