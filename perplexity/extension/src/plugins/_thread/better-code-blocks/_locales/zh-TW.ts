import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "自動換行",
      unwrap: "取消自動換行",
    },
    expand: {
      expand: "展開",
      collapse: "收合",
    },
  },
} as const satisfies LanguageMessages;
