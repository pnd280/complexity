import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "লাইন মোড়ান",
      unwrap: "লাইন আনমোড়ান",
    },
    expand: {
      expand: "বিস্তৃত করুন",
      collapse: "সংকুচিত করুন",
    },
  },
} as const satisfies LanguageMessages;
