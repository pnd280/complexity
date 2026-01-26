import type { TranslationShape } from "@complexity/i18n";

import type translations from "@/plugins/command-menu/_locales/en-US";

export const namespace = "plugin-command-menu";

export type Translations = TranslationShape<typeof translations>;

declare module "@complexity/i18n" {
  interface TranslationsRegistry {
    [namespace]: typeof translations;
  }
}
