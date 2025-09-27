import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Exportovať",
  format: {
    label: "Zvoliť formát",
    placeholder: "Vyberte formát",
  },
  includeCitations: "Zahrnúť citácie",
  actions: {
    download: "Stiahnuť",
    copy: "Kopírovať",
  },
  errors: {
    downloadFailed: {
      title: "❌ Sťahovanie zlyhalo",
      unknownError: "Vyskytla sa neznáma chyba",
    },
  },
} as const satisfies Translations;
