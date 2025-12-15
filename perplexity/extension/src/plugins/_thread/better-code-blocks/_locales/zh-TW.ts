import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

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
} as const satisfies Translations;
