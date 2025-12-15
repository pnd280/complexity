import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

export default {
  headerButtons: {
    wrap: {
      wrap: "Regels afbreken",
      unwrap: "Regelafbreking verwijderen",
    },
    expand: {
      expand: "Uitvouwen",
      collapse: "Invouwen",
    },
  },
} as const satisfies Translations;
