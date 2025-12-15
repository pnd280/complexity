import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "বার্তা কপি করুন",
  options: {
    default: "ডিফল্ট",
    withoutCitations: "উদ্ধৃতি ছাড়া",
  },
} as const satisfies Translations;
