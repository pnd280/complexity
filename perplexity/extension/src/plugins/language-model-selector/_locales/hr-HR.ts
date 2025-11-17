import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  languageModelSelector: {
    tooltip: "Odaberite jezični model",
    proSearch: {},
    autoMode: {
      title: "Auto",
      description: "Prilagođava se vašem upitu",
    },
    usesLeft: {
      unlimited: "Neograničeno",
      limited: dt("{count:plural} preostalo", {
        plural: {
          count: {
            one: "1 korištenje",
            other: "{?} korištenja",
          },
        },
      }),
    },
  },
  imageGenModelSelector: {
    tooltip: "Odaberite model slike",
  },
} as const satisfies LanguageMessages;
