import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

export default {
  languageModelSelector: {
    tooltip: "Scegli modello linguistico",
    proSearch: {},
    autoMode: {
      title: "Auto",
      description: "Si adatta alla tua richiesta",
    },
    usesLeft: {
      unlimited: "Illimitato",
      limited: dt("{count:plural} rimasti", {
        plural: {
          count: {
            one: "1 utilizzo",
            other: "{?} utilizzi",
          },
        },
      }),
    },
    modelsListEditToggle: {
      instruction:
        "Fai clic su qualsiasi modello per mostrarlo/nasconderlo dall'elenco",
      save: "Salva",
    },
  },
  imageGenModelSelector: {
    tooltip: "Scegli modello immagine",
  },
} as const satisfies Translations;
