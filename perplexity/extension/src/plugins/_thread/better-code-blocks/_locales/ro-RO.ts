import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

export default {
  headerButtons: {
    wrap: {
      wrap: "Încadrează liniile",
      unwrap: "Anulează încadrarea liniilor",
    },
    expand: {
      expand: "Extinde",
      collapse: "Restrânge",
    },
  },
} as const satisfies Translations;
