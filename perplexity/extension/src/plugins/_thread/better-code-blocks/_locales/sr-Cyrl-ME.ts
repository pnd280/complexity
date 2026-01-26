import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

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
} as const satisfies Translations;
