import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  languageModelSelector: {
    tooltip: "Kies taalmodel",
    proSearch: {},
    autoMode: {
      title: "Automatisch",
      description: "Past zich aan uw vraag aan",
    },
    usesLeft: {
      unlimited: "Onbeperkt",
      limited: dt("{count:plural} over", {
        plural: {
          count: {
            one: "1 keer",
            other: "{?} keer",
          },
        },
      }),
    },
  },
  imageGenModelSelector: {
    tooltip: "Kies beeldmodel",
  },
} as const satisfies LanguageMessages;
