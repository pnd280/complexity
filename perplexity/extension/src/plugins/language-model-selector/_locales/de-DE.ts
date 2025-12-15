import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

export default {
  languageModelSelector: {
    tooltip: "Sprachmodell auswählen",
    proSearch: {},
    autoMode: {
      title: "Auto",
      description: "Passt sich Ihrer Anfrage an",
    },
    usesLeft: {
      unlimited: "Unbegrenzt",
      limited: dt("{count:plural} übrig", {
        plural: {
          count: {
            one: "1 Nutzung",
            other: "{?} Nutzungen",
          },
        },
      }),
    },
    modelsListEditToggle: {
      instruction:
        "Klicken Sie auf ein beliebiges Modell, um es aus der Liste ein-/auszublenden",
      save: "Speichern",
    },
  },
  imageGenModelSelector: {
    tooltip: "Bildmodell auswählen",
  },
} as const satisfies Translations;
