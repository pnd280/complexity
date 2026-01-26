import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

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
    modelsListEditToggle: {
      instruction:
        "Faceți clic pe orice model pentru a-l afișa/ascunde din listă",
      save: "Salvare",
    },
  },
  imageGenModelSelector: {
    tooltip: "Alegeți modelul de imagine",
  },
} as const satisfies Translations;
