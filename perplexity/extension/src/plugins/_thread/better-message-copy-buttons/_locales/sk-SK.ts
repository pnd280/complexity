import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Kopírovať správu",
  options: {
    default: "Predvolené",
    withoutCitations: "Bez citácií",
  },
} as const satisfies Translations;
