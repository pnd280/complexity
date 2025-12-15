import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Bericht kopiëren",
  options: {
    default: "Standaard",
    withoutCitations: "Zonder citaten",
  },
} as const satisfies Translations;
