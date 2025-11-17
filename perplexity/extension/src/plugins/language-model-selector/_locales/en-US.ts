import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  languageModelSelector: {
    tooltip: "Choose language model",
    proSearch: {},
    autoMode: {
      title: "Auto",
      description: "Adapts to your query",
    },
    usesLeft: {
      unlimited: "Unlimited",
      limited: dt("{count:plural} left", {
        plural: {
          count: {
            one: "1 use",
            other: "{?} uses",
          },
        },
      }),
    },
  },
  imageGenModelSelector: {
    tooltip: "Choose image model",
  },
} as const satisfies LanguageMessages;
