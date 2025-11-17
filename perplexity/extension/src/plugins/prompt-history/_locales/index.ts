import type { TranslationShape } from "@complexity/i18n";

import type translations from "@/plugins/prompt-history/_locales/en-US";

export const namespace = "plugin-prompt-history";

export type Translations = TranslationShape<typeof translations>;

declare module "@complexity/i18n" {
  interface TranslationsRegistry {
    [namespace]: typeof translations;
  }
}
