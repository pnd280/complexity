import type { Translations } from "@/plugins/export-thread/_locales/index";

export default {
  action: "Exportovat",
  format: {
    label: "Zvolit formát",
    placeholder: "Vyberte formát",
  },
  includeCitations: "Zahrnout citace",
  actions: {
    download: "Stáhnout",
    copy: "Kopírovat",
  },
  errors: {
    downloadFailed: {
      title: "❌ Stahování selhalo",
      unknownError: "Došlo k neznámé chybě",
    },
  },
} as const satisfies Translations;
