import type { TranslationShape } from "@complexity/i18n";

import type translations from "@/plugins/thread-better-code-blocks/_locales/plugin-better-code-blocks.en-US";

export const namespace = "plugin-better-code-blocks";

export type Translations = TranslationShape<typeof translations>;

declare module "@complexity/i18n" {
  interface TranslationsRegistry {
    [namespace]: typeof translations;
  }
}
