import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

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
} as const satisfies Translations;
