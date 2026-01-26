import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

export default {
  languageModelSelector: {
    tooltip: "Vyberte jazykový model",
    proSearch: {},
    autoMode: {
      title: "Automaticky",
      description: "Prispôsobí sa vašej požiadavke",
    },
    usesLeft: {
      unlimited: "Neobmedzené",
      limited: dt("Zostáva {count:plural}", {
        plural: {
          count: {
            one: "1 použitie",
            other: "{?} použití",
          },
        },
      }),
    },
    modelsListEditToggle: {
      instruction:
        "Kliknutím na ľubovoľný model ho zobrazíte/skryjete zo zoznamu",
      save: "Uložiť",
    },
  },
  imageGenModelSelector: {
    tooltip: "Vyberte model obrázka",
  },
} as const satisfies Translations;
