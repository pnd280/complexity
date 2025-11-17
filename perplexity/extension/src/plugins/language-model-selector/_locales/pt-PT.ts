import { dt, type LanguageMessages } from "@complexity/i18n";

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
            one: "1 utilização",
            other: "{?} utilizações",
          },
        },
      }),
    },
  },
  imageGenModelSelector: {
    tooltip: "Escolher modelo de imagem",
  },
} as const satisfies LanguageMessages;
