import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

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
} as const satisfies Translations;
