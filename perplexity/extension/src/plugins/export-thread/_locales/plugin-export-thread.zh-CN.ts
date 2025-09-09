import type { Translations } from "@/plugins/export-thread/_locales/index";

export default {
  action: "导出",
  format: {
    label: "选择格式",
    placeholder: "选择一种格式",
  },
  includeCitations: "包含引用",
  actions: {
    download: "下载",
    copy: "复制",
  },
  errors: {
    downloadFailed: {
      title: "❌ 下载失败",
      unknownError: "发生未知错误",
    },
  },
} as const satisfies Translations;
