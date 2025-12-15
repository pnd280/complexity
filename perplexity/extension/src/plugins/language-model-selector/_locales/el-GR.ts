import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

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
    modelsListEditToggle: {
      instruction:
        "Κάντε κλικ σε οποιοδήποτε μοντέλο για να το εμφανίσετε/αποκρύψετε από τη λίστα",
      save: "Αποθήκευση",
    },
  },
  imageGenModelSelector: {
    tooltip: "Επιλέξτε μοντέλο εικόνας",
  },
} as const satisfies Translations;
