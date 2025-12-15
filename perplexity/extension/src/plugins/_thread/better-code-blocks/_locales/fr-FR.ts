import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

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
} as const satisfies Translations;
