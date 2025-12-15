import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Скопировать сообщение",
  options: {
    default: "По умолчанию",
    withoutCitations: "Без цитат",
  },
} as const satisfies Translations;
