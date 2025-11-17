import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Retour à la ligne",
      unwrap: "Annuler le retour à la ligne",
    },
    expand: {
      expand: "Développer",
      collapse: "Réduire",
    },
  },
} as const satisfies LanguageMessages;
