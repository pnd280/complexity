import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Copiar mensagem",
  options: {
    default: "Padrão",
    withoutCitations: "Sem citações",
  },
} as const satisfies Translations;
