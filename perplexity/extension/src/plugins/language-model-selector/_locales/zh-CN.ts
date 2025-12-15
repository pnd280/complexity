import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

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
    modelsListEditToggle: {
      instruction: "点击任何模型以在列表中显示/隐藏",
      save: "保存",
    },
  },
  imageGenModelSelector: {
    tooltip: "选择图像模型",
  },
} as const satisfies Translations;
