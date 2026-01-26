import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "メッセージをコピー",
  options: {
    default: "デフォルト",
    withoutCitations: "引用なし",
  },
} as const satisfies Translations;
