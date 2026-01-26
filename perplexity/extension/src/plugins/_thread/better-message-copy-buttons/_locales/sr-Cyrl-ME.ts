import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Копирај поруку",
  options: {
    default: "Подразумевано",
    withoutCitations: "Без цитата",
  },
} as const satisfies Translations;
