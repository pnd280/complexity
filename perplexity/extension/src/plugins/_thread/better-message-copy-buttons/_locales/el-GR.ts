import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Αντιγραφή μηνύματος",
  options: {
    default: "Προεπιλογή",
    withoutCitations: "Χωρίς παραπομπές",
  },
} as const satisfies Translations;
