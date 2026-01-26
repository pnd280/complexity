import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

export default {
  languageModelSelector: {
    tooltip: "言語モデルを選択",
    proSearch: {},
    autoMode: {
      title: "自動",
      description: "クエリに合わせて自動調整",
    },
    usesLeft: {
      unlimited: "無制限",
      limited: dt("残り{count:plural}", {
        plural: {
          count: {
            one: "1回",
            other: "{?}回",
          },
        },
      }),
    },
    modelsListEditToggle: {
      instruction: "任意のモデルをクリックしてリストから表示/非表示にします",
      save: "保存",
    },
  },
  imageGenModelSelector: {
    tooltip: "画像モデルを選択",
  },
} as const satisfies Translations;
