import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

export default {
  headerButtons: {
    wrap: {
      wrap: "Vai a capo",
      unwrap: "Rimuovi a capo",
    },
    expand: {
      expand: "Espandi",
      collapse: "Comprimi",
    },
  },
} as const satisfies Translations;
