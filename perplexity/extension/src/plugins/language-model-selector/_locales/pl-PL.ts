import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

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
    modelsListEditToggle: {
      instruction: "Kliknij dowolny model, aby go wyświetlić/ukryć z listy",
      save: "Zapisz",
    },
  },
  imageGenModelSelector: {
    tooltip: "Wybierz model obrazu",
  },
} as const satisfies Translations;
