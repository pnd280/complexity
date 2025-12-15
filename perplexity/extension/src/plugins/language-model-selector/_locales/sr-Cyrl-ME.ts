import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

export default {
  languageModelSelector: {
    tooltip: "Изаберите језички модел",
    proSearch: {},
    autoMode: {
      title: "Ауто",
      description: "Прилагођава се вашем упиту",
    },
    usesLeft: {
      unlimited: "Неограничено",
      limited: dt("{count:plural} преостало", {
        plural: {
          count: {
            one: "1 употреба",
            other: "{?} употреба",
          },
        },
      }),
    },
    modelsListEditToggle: {
      instruction:
        "Кликните на било који модел да га приказујете/скривате са листе",
      save: "Сачувај",
    },
  },
  imageGenModelSelector: {
    tooltip: "Изаберите модел слике",
  },
} as const satisfies Translations;
