import { dt, type LanguageMessages } from "@complexity/i18n";

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
  },
  imageGenModelSelector: {
    tooltip: "Bildmodell auswählen",
  },
} as const satisfies LanguageMessages;
