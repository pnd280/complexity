import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Zalamovat řádky",
      unwrap: "Nezalamovat řádky",
    },
    expand: {
      expand: "Rozbalit",
      collapse: "Sbalit",
    },
  },
} as const satisfies LanguageMessages;
