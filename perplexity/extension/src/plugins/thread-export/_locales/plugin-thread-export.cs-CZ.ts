import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Exportovat",
  format: {
    label: "Zvolit formát",
    placeholder: "Vyberte formát",
  },
  includeCitations: "Zahrnout citace",
  actions: {
    download: "Stáhnout",
    largeFileDownloadPrompt: {
      title: "Vaše stažení je připraveno",
      description: "Klikněte zde pro zahájení stažení",
    },
    copy: "Kopírovat",
  },
  waiting: {
    title: "Prosím počkejte...",
    description: "Extrahování obsahu, to může chvíli trvat",
  },
  errors: {
    downloadFailed: {
      title: "❌ Stahování selhalo",
      unknownError: "Došlo k neznámé chybě",
    },
    copyFailed: {
      title: "❌ Kopírování selhalo",
      unknownError: "Došlo k neznámé chybě",
    },
  },
} as const satisfies Translations;
