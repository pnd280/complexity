import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Copiază mesajul",
  options: {
    default: "Implicit",
    withoutCitations: "Fără citate",
  },
} as const satisfies Translations;
