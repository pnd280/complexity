import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage: "捐款以維持專案運作！",
  },
  sponsorDialog: {
    title: "協助讓 Complexity 持續優秀！",
    description:
      "無數小時已被投入，使 Complexity 成為一個強大且精緻的工具。您的支持直接推動持續開發、新功能，並讓一切順利運作。",
    descriptionLine2:
      "如果 Complexity 為您的工作流程帶來價值，請考慮為它的未來貢獻一份心力！",
    cometAffiliate: {
      title: "試試 Comet - 取得免費 <0/> 訂閱!",
      description:
        "試試 Comet - Perplexity 推出的全新瀏覽器 - 取得免費 <0/> 訂閱，同時直接為 Complexity 的開發做出貢獻。",
      claimButton: "立即領取",
      dismissButton: "關閉",
    },
    donation: {
      title: "💖 支持未來開發",
    },
    sponsorship: {
      title: "🌟 有興趣贊助嗎？",
      contactEmail: "透過 Email 聯絡",
    },
  },
  misc: {
    words: "單字",
    characters: "字元",
    rewrite: "重寫",
    speakAloud: "朗讀",
    stop: "停止",
  },
  releaseNotes: {
    title: "已更新至 v{version}",
    dontShowAgain: "不再顯示此更新",
    confirmDialog: {
      title: "確認",
      message: "確定不再顯示此更新？您可以隨時在設定頁重新啟用此彈窗。",
      cancel: "取消",
      confirm: "我知道了",
    },
    dismiss: "關閉",
  },
} as const satisfies Translations;
