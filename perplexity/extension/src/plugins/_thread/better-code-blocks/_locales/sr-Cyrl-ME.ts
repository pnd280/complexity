import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Преломи редове",
      unwrap: "Поништи прелом редова",
    },
    expand: {
      expand: "Прошири",
      collapse: "Сажми",
    },
  },
} as const satisfies LanguageMessages;
