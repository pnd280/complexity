import type { TranslationShape } from "@complexity/i18n";

import type translations from "@/plugins/_thread/better-rewrite-dropdown/_locales/en-US";

export const namespace = "plugin-thread-better-rewrite-dropdown";

export type Translations = TranslationShape<typeof translations>;

declare module "@complexity/i18n" {
  interface TranslationsRegistry {
    [namespace]: typeof translations;
  }
}
