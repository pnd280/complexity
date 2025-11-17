import { dt, type LanguageMessages } from "@complexity/i18n";

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
  },
  imageGenModelSelector: {
    tooltip: "Scegli modello immagine",
  },
} as const satisfies LanguageMessages;
