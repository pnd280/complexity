import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Nachricht kopieren",
  options: {
    default: "Standard",
    withoutCitations: "Ohne Zitate",
  },
} as const satisfies Translations;
