import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

export default {
  languageModelSelector: {
    tooltip: "언어 모델 선택",
    proSearch: {},
    autoMode: {
      title: "자동",
      description: "질문에 맞게 자동으로 조정됩니다",
    },
    usesLeft: {
      unlimited: "무제한",
      limited: dt("{count:plural}회 남음", {
        plural: {
          count: {
            one: "1회",
            other: "{?}회",
          },
        },
      }),
    },
    modelsListEditToggle: {
      instruction: "모든 모델을 클릭하여 목록에서 표시/숨기기",
      save: "저장",
    },
  },
  imageGenModelSelector: {
    tooltip: "이미지 모델 선택",
  },
} as const satisfies Translations;
