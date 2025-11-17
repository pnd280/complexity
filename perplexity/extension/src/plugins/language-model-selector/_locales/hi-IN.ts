import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  languageModelSelector: {
    tooltip: "भाषा मॉडल चुनें",
    proSearch: {},
    autoMode: {
      title: "स्वचालित",
      description: "आपकी क्वेरी के अनुसार अनुकूलित होता है",
    },
    usesLeft: {
      unlimited: "असीमित",
      limited: dt("{count:plural} शेष", {
        plural: {
          count: {
            one: "1 उपयोग",
            other: "{?} उपयोग",
          },
        },
      }),
    },
  },
  imageGenModelSelector: {
    tooltip: "इमेज मॉडल चुनें",
  },
} as const satisfies LanguageMessages;
