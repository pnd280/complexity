import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Zeilen umbrechen",
      unwrap: "Zeilenumbruch entfernen",
    },
    expand: {
      expand: "Erweitern",
      collapse: "Reduzieren",
    },
  },
} as const satisfies LanguageMessages;
