import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

export default {
  headerButtons: {
    wrap: {
      wrap: "Quebrar linhas",
      unwrap: "Desfazer quebra de linhas",
    },
    expand: {
      expand: "Expandir",
      collapse: "Recolher",
    },
  },
} as const satisfies Translations;
