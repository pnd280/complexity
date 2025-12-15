import type { TranslationShape } from "@complexity/i18n";

import type translations from "@/plugins/_thread/message-completion-notification/_locales/en-US";

export const namespace = "plugin-thread-message-completion-notification";

export type Translations = TranslationShape<typeof translations>;

declare module "@complexity/i18n" {
  interface TranslationsRegistry {
    [namespace]: typeof translations;
  }
}
