import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Regels afbreken",
      unwrap: "Regelafbreking verwijderen",
    },
    expand: {
      expand: "Uitvouwen",
      collapse: "Invouwen",
    },
  },
} as const satisfies LanguageMessages;
