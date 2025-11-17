import { dt, type LanguageMessages } from "@complexity/i18n";

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
  },
  imageGenModelSelector: {
    tooltip: "画像モデルを選択",
  },
} as const satisfies LanguageMessages;
