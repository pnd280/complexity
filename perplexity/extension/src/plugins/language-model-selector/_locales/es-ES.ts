import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

export default {
  languageModelSelector: {
    tooltip: "Elegir modelo de lenguaje",
    proSearch: {},
    autoMode: {
      title: "Auto",
      description: "Se adapta a tu consulta",
    },
    usesLeft: {
      unlimited: "Ilimitado",
      limited: dt("{count:plural} restantes", {
        plural: {
          count: {
            one: "1 uso",
            other: "{?} usos",
          },
        },
      }),
    },
    modelsListEditToggle: {
      instruction:
        "Haz clic en cualquier modelo para mostrarlo/ocultarlo de la lista",
      save: "Guardar",
    },
  },
  imageGenModelSelector: {
    tooltip: "Elegir modelo de imagen",
  },
} as const satisfies Translations;
