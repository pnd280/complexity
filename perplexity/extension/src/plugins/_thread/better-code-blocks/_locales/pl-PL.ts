import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Zawijaj wiersze",
      unwrap: "Odwijać wiersze",
    },
    expand: {
      expand: "Rozwiń",
      collapse: "Zwiń",
    },
  },
} as const satisfies LanguageMessages;
