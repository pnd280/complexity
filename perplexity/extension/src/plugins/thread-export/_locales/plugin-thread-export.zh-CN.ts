import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "导出",
  format: {
    label: "选择格式",
    placeholder: "选择一种格式",
  },
  includeCitations: "包含引用",
  actions: {
    download: "下载",
    largeFileDownloadPrompt: {
      title: "您的下载已准备就绪",
      description: "点击此处开始下载",
    },
    copy: "复制",
  },
  errors: {
    downloadFailed: {
      title: "❌ 下载失败",
      unknownError: "发生未知错误",
    },
  },
} as const satisfies Translations;
