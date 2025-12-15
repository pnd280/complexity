import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

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
} as const satisfies Translations;
