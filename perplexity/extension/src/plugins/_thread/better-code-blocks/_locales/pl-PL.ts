import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

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
} as const satisfies Translations;
