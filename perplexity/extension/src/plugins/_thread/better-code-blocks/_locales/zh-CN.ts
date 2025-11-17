import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "自动换行",
      unwrap: "取消自动换行",
    },
    expand: {
      expand: "展开",
      collapse: "收起",
    },
  },
} as const satisfies LanguageMessages;
