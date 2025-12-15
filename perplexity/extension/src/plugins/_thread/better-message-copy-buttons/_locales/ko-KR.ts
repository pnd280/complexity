import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "메시지 복사",
  options: {
    default: "기본값",
    withoutCitations: "인용문 없이",
  },
} as const satisfies Translations;
