import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "줄 바꿈",
      unwrap: "줄 바꿈 해제",
    },
    expand: {
      expand: "확장",
      collapse: "접기",
    },
  },
} as const satisfies LanguageMessages;
