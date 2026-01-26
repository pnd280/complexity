import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

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
    modelsListEditToggle: {
      instruction:
        "Kliknite na bilo koji model da ga prikazujete/skrivate s popisa",
      save: "Spremi",
    },
  },
  imageGenModelSelector: {
    tooltip: "Odaberite model slike",
  },
} as const satisfies Translations;
