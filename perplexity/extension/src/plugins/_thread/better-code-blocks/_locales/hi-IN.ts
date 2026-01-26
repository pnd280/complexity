import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

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
} as const satisfies Translations;
