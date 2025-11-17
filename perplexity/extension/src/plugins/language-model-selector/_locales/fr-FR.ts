import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  languageModelSelector: {
    tooltip: "Choisir le modèle de langue",
    proSearch: {},
    autoMode: {
      title: "Auto",
      description: "S'adapte à votre requête",
    },
    usesLeft: {
      unlimited: "Illimité",
      limited: dt("{count:plural} restant(s)", {
        plural: {
          count: {
            one: "1 utilisation",
            other: "{?} utilisations",
          },
        },
      }),
    },
  },
  imageGenModelSelector: {
    tooltip: "Choisir le modèle d'image",
  },
} as const satisfies LanguageMessages;
