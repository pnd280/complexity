import type { Translations } from "@/plugins/prompt-history/_locales/index";

export default {
  clearAllButton: {
    dialog: {
      title: "清除提示历史",
      message: "您确定要清除所有提示历史吗？此操作无法撤销。",
      actions: {
        cancel: "取消",
        confirm: "全部清除",
      },
    },
  },
  search: {
    placeholder: "搜索提示历史...",
    noResults: "未找到结果",
  },
} as const satisfies Translations;
