import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  languageModelSelector: {
    tooltip: "選擇語言模型",
    proSearch: {},
    autoMode: {
      title: "自動",
      description: "根據您的查詢自動調整",
    },
    usesLeft: {
      unlimited: "無限制",
      limited: dt("剩下 {count:plural}", {
        plural: {
          count: {
            one: "1 次",
            other: "{?} 次",
          },
        },
      }),
    },
  },
  imageGenModelSelector: {
    tooltip: "選擇圖像模型",
  },
} as const satisfies LanguageMessages;
