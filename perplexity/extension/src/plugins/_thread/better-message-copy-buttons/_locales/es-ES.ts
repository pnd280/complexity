import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Copiar mensaje",
  options: {
    default: "Predeterminado",
    withoutCitations: "Sin citas",
  },
} as const satisfies Translations;
