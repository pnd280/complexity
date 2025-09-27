import type { TranslationShape } from "@complexity/i18n";

import type translations from "@/plugins/thread-export/_locales/plugin-thread-export.en-US";

export const namespace = "plugin-thread-export";

export type Translations = TranslationShape<typeof translations>;

declare module "@complexity/i18n" {
  interface TranslationsRegistry {
    [namespace]: typeof translations;
  }
}
