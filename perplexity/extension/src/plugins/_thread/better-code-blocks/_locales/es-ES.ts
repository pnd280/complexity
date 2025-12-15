import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

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
} as const satisfies Translations;
