import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Αναδίπλωση γραμμών",
      unwrap: "Αναδίπλωση εκτός γραμμών",
    },
    expand: {
      expand: "Επέκταση",
      collapse: "Σύμπτυξη",
    },
  },
} as const satisfies LanguageMessages;
