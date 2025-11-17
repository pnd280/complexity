import type { Translations } from "@/plugins/_thread/export/_locales/index";

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
  waiting: {
    title: "お待ちください...",
    description: "コンテンツを抽出中です。少々お時間をいただく場合があります",
  },
  errors: {
    downloadFailed: {
      title: "❌ ダウンロードに失敗しました",
      unknownError: "不明なエラーが発生しました",
    },
    copyFailed: {
      title: "❌ コピーに失敗しました",
      unknownError: "不明なエラーが発生しました",
    },
  },
} as const satisfies Translations;
