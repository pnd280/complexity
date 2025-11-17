import { dt, type LanguageMessages } from "@complexity/i18n";

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
  },
  imageGenModelSelector: {
    tooltip: "Выберите модель изображения",
  },
} as const satisfies LanguageMessages;
