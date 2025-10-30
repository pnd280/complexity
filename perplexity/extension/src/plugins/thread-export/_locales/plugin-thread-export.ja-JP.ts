import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "エクスポート",
  format: {
    label: "フォーマットを選択",
    placeholder: "フォーマットを選択してください",
  },
  includeCitations: "引用を含める",
  actions: {
    download: "ダウンロード",
    largeFileDownloadPrompt: {
      title: "ダウンロードの準備ができました",
      description: "ここをクリックしてダウンロードを開始",
    },
    copy: "コピー",
  },
  errors: {
    downloadFailed: {
      title: "❌ ダウンロードに失敗しました",
      unknownError: "不明なエラーが発生しました",
    },
  },
} as const satisfies Translations;
