import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

export default {
  headerButtons: {
    wrap: {
      wrap: "Prelomi redove",
      unwrap: "Ukloni prelamanje redova",
    },
    expand: {
      expand: "Proširi",
      collapse: "Sažmi",
    },
  },
} as const satisfies Translations;
