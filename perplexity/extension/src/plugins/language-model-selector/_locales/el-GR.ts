import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  languageModelSelector: {
    tooltip: "Επιλέξτε μοντέλο γλώσσας",
    proSearch: {},
    autoMode: {
      title: "Αυτόματο",
      description: "Προσαρμόζεται στο ερώτημά σας",
    },
    usesLeft: {
      unlimited: "Απεριόριστο",
      limited: dt("{count:plural} απομένουν", {
        plural: {
          count: {
            one: "1 χρήση",
            other: "{?} χρήσεις",
          },
        },
      }),
    },
  },
  imageGenModelSelector: {
    tooltip: "Επιλέξτε μοντέλο εικόνας",
  },
} as const satisfies LanguageMessages;
