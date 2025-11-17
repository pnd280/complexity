import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Încadrează liniile",
      unwrap: "Anulează încadrarea liniilor",
    },
    expand: {
      expand: "Extinde",
      collapse: "Restrânge",
    },
  },
} as const satisfies LanguageMessages;
