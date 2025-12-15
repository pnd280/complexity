import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

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
} as const satisfies Translations;
