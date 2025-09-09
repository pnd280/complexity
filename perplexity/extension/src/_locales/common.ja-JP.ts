import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage:
      "プロジェクトを存続させるために<0>サポーター</0>になることをご検討ください！",
  },
  sponsorDialog: {
    title: "Complexityを素晴らしく保つためにご協力を！",
    description:
      "Complexityを強力で洗練されたツールにするために、私たちは数え切れないほどの時間を費やしてきました。あなたのサポートは、継続的な開発、新機能、そしてすべてを円滑に運営するための原動力となります。",
    descriptionLine2:
      "Complexityがあなたのワークフローに価値をもたらしているなら、今後の発展のためにご支援をお願いします！",
    donation: {
      title: "💖 今後の開発を支援する",
    },
    sponsorship: {
      title: "🌟 スポンサーシップに興味がありますか？",
      contactEmail: "メールで連絡",
    },
  },
  misc: {
    words: "単語",
    characters: "文字",
    rewrite: "書き換え",
    speakAloud: "音読する",
    stop: "停止",
  },
  releaseNotes: {
    title: "v{version} に更新されました",
    dontShowAgain: "今後のアップデートでは表示しない",
    confirmDialog: {
      title: "確認",
      message:
        "今後のアップデートで表示しないようにしますか？設定ページでいつでもこのポップアップを再有効化できます。",
      cancel: "キャンセル",
      confirm: "理解しました",
    },
    dismiss: "閉じる",
  },
} as const satisfies Translations;
