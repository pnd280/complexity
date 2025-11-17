import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  languageModelSelector: {
    tooltip: "选择语言模型",
    proSearch: {},
    autoMode: {
      title: "自动",
      description: "根据您的查询自动调整",
    },
    usesLeft: {
      unlimited: "无限制",
      limited: dt("剩余 {count:plural}", {
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
    tooltip: "选择图像模型",
  },
} as const satisfies LanguageMessages;
