import { dt, type LanguageMessages } from "@complexity/i18n";

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
  },
  imageGenModelSelector: {
    tooltip: "Изаберите модел слике",
  },
} as const satisfies LanguageMessages;
