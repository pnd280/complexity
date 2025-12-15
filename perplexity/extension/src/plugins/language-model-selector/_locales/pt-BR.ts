import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

export default {
  languageModelSelector: {
    tooltip: "Escolher modelo de linguagem",
    proSearch: {},
    autoMode: {
      title: "Automático",
      description: "Adapta-se à sua consulta",
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
      instruction: "Clique em qualquer modelo para mostrar/ocultar da lista",
      save: "Salvar",
    },
  },
  imageGenModelSelector: {
    tooltip: "Escolher modelo de imagem",
  },
} as const satisfies Translations;
