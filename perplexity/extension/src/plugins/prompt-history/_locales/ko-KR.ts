import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "프롬프트 기록 삭제",
      message:
        "모든 프롬프트 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      actions: {
        cancel: "취소",
        confirm: "모두 삭제",
      },
    },
  },
  search: {
    placeholder: "프롬프트 기록 검색...",
    noResults: "결과가 없습니다",
  },
} as const satisfies LanguageMessages;
