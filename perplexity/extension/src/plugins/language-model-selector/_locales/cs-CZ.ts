import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

export default {
  languageModelSelector: {
    tooltip: "Vyberte jazykový model",
    proSearch: {},
    autoMode: {
      title: "Automaticky",
      description: "Přizpůsobí se vašemu dotazu",
    },
    usesLeft: {
      unlimited: "Neomezeně",
      limited: dt("Zbývá {count:plural}", {
        plural: {
          count: {
            one: "1 použití",
            other: "{?} použití",
          },
        },
      }),
    },
    modelsListEditToggle: {
      instruction:
        "Kliknutím na libovolný model jej zobrazíte/skryjete ze seznamu",
      save: "Uložit",
    },
  },
  imageGenModelSelector: {
    tooltip: "Vyberte model obrázku",
  },
} as const satisfies Translations;
