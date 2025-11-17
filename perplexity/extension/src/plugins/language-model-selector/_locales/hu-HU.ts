import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  languageModelSelector: {
    tooltip: "Válassz nyelvi modellt",
    proSearch: {},
    autoMode: {
      title: "Automatikus",
      description: "Alkalmazkodik a lekérdezésedhez",
    },
    usesLeft: {
      unlimited: "Korlátlan",
      limited: dt("{count:plural} maradt", {
        plural: {
          count: {
            one: "1 használat",
            other: "{?} használat",
          },
        },
      }),
    },
  },
  imageGenModelSelector: {
    tooltip: "Válassz képgeneráló modellt",
  },
} as const satisfies LanguageMessages;
