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
    largeFileDownloadPrompt: {
      title: "Vaše sťahovanie je pripravené",
      description: "Kliknite sem pre spustenie sťahovania",
    },
    copy: "Kopírovať",
  },
  waiting: {
    title: "Prosím čakajte...",
    description: "Extrahovanie obsahu, to môže chvíľu trvať",
  },
  errors: {
    downloadFailed: {
      title: "❌ Sťahovanie zlyhalo",
      unknownError: "Vyskytla sa neznáma chyba",
    },
    copyFailed: {
      title: "❌ Kopírovanie zlyhalo",
      unknownError: "Vyskytla sa neznáma chyba",
    },
  },
} as const satisfies Translations;
