import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

export default {
  headerButtons: {
    wrap: {
      wrap: "行を折り返す",
      unwrap: "行の折り返しを解除",
    },
    expand: {
      expand: "展開",
      collapse: "折りたたむ",
    },
  },
} as const satisfies Translations;
