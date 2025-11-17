import type { LanguageMessages } from "@complexity/i18n";

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
} as const satisfies LanguageMessages;
