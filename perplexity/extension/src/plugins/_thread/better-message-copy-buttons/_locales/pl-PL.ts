import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Kopiuj wiadomość",
  options: {
    default: "Domyślne",
    withoutCitations: "Bez cytatów",
  },
} as const satisfies Translations;
