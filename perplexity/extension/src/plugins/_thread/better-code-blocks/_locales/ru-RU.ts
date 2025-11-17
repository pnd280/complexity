import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Перенос строк",
      unwrap: "Без переноса строк",
    },
    expand: {
      expand: "Развернуть",
      collapse: "Свернуть",
    },
  },
} as const satisfies LanguageMessages;
