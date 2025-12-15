import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

export default {
  languageModelSelector: {
    tooltip: "Válassz nyelvi modellt",
    proSearch: {},
    autoMode: {
      title: "Automatikus",
      description: "Alkalmazkodik a lekérdezésedhez",
    },
    usesLeft: {
      unlimited: "Korlátlan",
      limited: dt("{count:plural} maradt", {
        plural: {
          count: {
            one: "1 használat",
            other: "{?} használat",
          },
        },
      }),
    },
    modelsListEditToggle: {
      instruction:
        "Kattintson bármelyik modellre a listából való megjelenítéshez/elrejtéshez",
      save: "Mentés",
    },
  },
  imageGenModelSelector: {
    tooltip: "Válassz képgeneráló modellt",
  },
} as const satisfies Translations;
