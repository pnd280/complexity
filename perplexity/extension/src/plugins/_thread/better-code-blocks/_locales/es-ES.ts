import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Ajustar líneas",
      unwrap: "Desajustar líneas",
    },
    expand: {
      expand: "Expandir",
      collapse: "Colapsar",
    },
  },
} as const satisfies LanguageMessages;
