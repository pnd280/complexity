import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Copier le message",
  options: {
    default: "Par défaut",
    withoutCitations: "Sans citations",
  },
} as const satisfies Translations;
