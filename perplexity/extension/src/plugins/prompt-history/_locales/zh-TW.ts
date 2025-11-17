import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "清除提示歷史紀錄",
      message: "您確定要清除所有提示歷史紀錄嗎？此操作無法還原。",
      actions: {
        cancel: "取消",
        confirm: "全部清除",
      },
    },
  },
  search: {
    placeholder: "搜尋提示歷史紀錄...",
    noResults: "未找到結果",
  },
} as const satisfies LanguageMessages;
