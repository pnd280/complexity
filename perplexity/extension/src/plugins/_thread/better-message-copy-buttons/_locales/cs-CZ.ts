import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Kopírovat zprávu",
  options: {
    default: "Výchozí",
    withoutCitations: "Bez citací",
  },
} as const satisfies Translations;
