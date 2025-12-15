import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

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
    modelsListEditToggle: {
      instruction: "किसी भी मॉडल को सूची से दिखाने/छिपाने के लिए क्लिक करें",
      save: "सहेजें",
    },
  },
  imageGenModelSelector: {
    tooltip: "इमेज मॉडल चुनें",
  },
} as const satisfies Translations;
