import { dt, type LanguageMessages } from "@complexity/i18n";

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
  },
  imageGenModelSelector: {
    tooltip: "Vyberte model obrázka",
  },
} as const satisfies LanguageMessages;
