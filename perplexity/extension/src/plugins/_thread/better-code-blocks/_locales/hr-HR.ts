import type { LanguageMessages } from "@complexity/i18n";

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
} as const satisfies LanguageMessages;
