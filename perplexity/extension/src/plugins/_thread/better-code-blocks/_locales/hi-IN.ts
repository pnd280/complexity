import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "पंक्तियाँ लपेटें",
      unwrap: "पंक्तियाँ न खोलें",
    },
    expand: {
      expand: "विस्तार करें",
      collapse: "संकुचित करें",
    },
  },
} as const satisfies LanguageMessages;
