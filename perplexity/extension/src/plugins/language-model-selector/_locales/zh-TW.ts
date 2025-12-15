import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

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
    modelsListEditToggle: {
      instruction: "點擊任何模型以在清單中顯示/隱藏",
      save: "保存",
    },
  },
  imageGenModelSelector: {
    tooltip: "選擇圖像模型",
  },
} as const satisfies Translations;
