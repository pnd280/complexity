import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Copia messaggio",
  options: {
    default: "Predefinito",
    withoutCitations: "Senza citazioni",
  },
} as const satisfies Translations;
