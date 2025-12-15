import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

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
    modelsListEditToggle: {
      instruction:
        "Klik op een model om het uit de lijst weer te geven/verbergen",
      save: "Opslaan",
    },
  },
  imageGenModelSelector: {
    tooltip: "Kies beeldmodel",
  },
} as const satisfies Translations;
