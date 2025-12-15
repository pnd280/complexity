import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

export default {
  languageModelSelector: {
    tooltip: "Выберите языковую модель",
    proSearch: {},
    autoMode: {
      title: "Авто",
      description: "Адаптируется к вашему запросу",
    },
    usesLeft: {
      unlimited: "Неограниченно",
      limited: dt("{count:plural} осталось", {
        plural: {
          count: {
            one: "1 использование",
            other: "{?} использований",
          },
        },
      }),
    },
    modelsListEditToggle: {
      instruction:
        "Нажмите на любую модель, чтобы показать/скрыть её из списка",
      save: "Сохранить",
    },
  },
  imageGenModelSelector: {
    tooltip: "Выберите модель изображения",
  },
} as const satisfies Translations;
