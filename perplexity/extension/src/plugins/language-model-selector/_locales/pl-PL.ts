import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  languageModelSelector: {
    tooltip: "Wybierz model językowy",
    proSearch: {},
    autoMode: {
      title: "Auto",
      description: "Dostosowuje się do Twojego zapytania",
    },
    usesLeft: {
      unlimited: "Nieograniczone",
      limited: dt("Pozostało {count:plural}", {
        plural: {
          count: {
            one: "1 użycie",
            other: "{?} użyć",
          },
        },
      }),
    },
  },
  imageGenModelSelector: {
    tooltip: "Wybierz model obrazu",
  },
} as const satisfies LanguageMessages;
