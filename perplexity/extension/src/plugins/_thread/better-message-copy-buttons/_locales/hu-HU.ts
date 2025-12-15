import type { Translations } from "@/plugins/_thread/better-message-copy-buttons/_locales/index";

export default {
  tooltip: "Üzenet másolása",
  options: {
    default: "Alapértelmezett",
    withoutCitations: "Hivatkozások nélkül",
  },
} as const satisfies Translations;
