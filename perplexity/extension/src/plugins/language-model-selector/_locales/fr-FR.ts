import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

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
    modelsListEditToggle: {
      instruction:
        "Cliquez sur n'importe quel modèle pour l'afficher/masquer de la liste",
      save: "Enregistrer",
    },
  },
  imageGenModelSelector: {
    tooltip: "Choisir le modèle d'image",
  },
} as const satisfies Translations;
