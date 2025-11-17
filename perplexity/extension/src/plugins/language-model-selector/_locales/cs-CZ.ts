import { dt, type LanguageMessages } from "@complexity/i18n";

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
  },
  imageGenModelSelector: {
    tooltip: "Vyberte model obrázku",
  },
} as const satisfies LanguageMessages;
