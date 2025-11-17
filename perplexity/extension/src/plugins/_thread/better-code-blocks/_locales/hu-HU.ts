import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Sorok tördelése",
      unwrap: "Sorok tördelésének megszüntetése",
    },
    expand: {
      expand: "Kibontás",
      collapse: "Összecsukás",
    },
  },
} as const satisfies LanguageMessages;
