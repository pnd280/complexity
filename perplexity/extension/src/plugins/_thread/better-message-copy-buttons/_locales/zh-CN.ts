import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "复制消息",
  options: {
    default: "默认",
    withoutCitations: "无引用",
  },
} as const satisfies Translations;
