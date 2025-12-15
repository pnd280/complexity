import type { TranslationShape } from "@complexity/i18n";

import type translations from "@/plugins/drag-n-drop-file-to-upload-in-thread/_locales/en-US";

export const namespace = "plugin-drag-n-drop-file-to-upload-in-thread";

export type Translations = TranslationShape<typeof translations>;

declare module "@complexity/i18n" {
  interface TranslationsRegistry {
    [namespace]: typeof translations;
  }
}
