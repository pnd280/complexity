import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  languageModelSelector: {
    tooltip: "Alegeți modelul de limbă",
    proSearch: {},
    autoMode: {
      title: "Auto",
      description: "Se adaptează la interogarea dvs.",
    },
    usesLeft: {
      unlimited: "Nelimitat",
      limited: dt("{count:plural} rămase", {
        plural: {
          count: {
            one: "1 utilizare",
            other: "{?} utilizări",
          },
        },
      }),
    },
  },
  imageGenModelSelector: {
    tooltip: "Alegeți modelul de imagine",
  },
} as const satisfies LanguageMessages;
