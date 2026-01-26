import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

export default {
  headerButtons: {
    wrap: {
      wrap: "Zeilen umbrechen",
      unwrap: "Zeilenumbruch entfernen",
    },
    expand: {
      expand: "Erweitern",
      collapse: "Reduzieren",
    },
  },
} as const satisfies Translations;
