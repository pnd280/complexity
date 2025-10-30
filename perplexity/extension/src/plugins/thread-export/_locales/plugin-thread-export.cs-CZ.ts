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
  errors: {
    downloadFailed: {
      title: "❌ Stahování selhalo",
      unknownError: "Došlo k neznámé chybě",
    },
  },
} as const satisfies Translations;
