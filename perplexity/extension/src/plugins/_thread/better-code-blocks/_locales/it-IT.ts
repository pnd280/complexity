import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Vai a capo",
      unwrap: "Rimuovi a capo",
    },
    expand: {
      expand: "Espandi",
      collapse: "Comprimi",
    },
  },
} as const satisfies LanguageMessages;
