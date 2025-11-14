import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "匯出",
  format: {
    label: "選擇格式",
    placeholder: "選擇一種格式",
  },
  includeCitations: "包含引用",
  actions: {
    download: "下載",
    largeFileDownloadPrompt: {
      title: "您的下載已準備就緒",
      description: "點擊此處開始下載",
    },
    copy: "複製",
  },
  waiting: {
    title: "請稍候...",
    description: "正在提取內容，這可能需要一些時間",
  },
  errors: {
    downloadFailed: {
      title: "❌ 下載失敗",
      unknownError: "發生未知錯誤",
    },
    copyFailed: {
      title: "❌ 複製失敗",
      unknownError: "發生未知錯誤",
    },
  },
} as const satisfies Translations;
