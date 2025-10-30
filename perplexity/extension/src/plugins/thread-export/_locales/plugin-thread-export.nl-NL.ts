import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Exporteren",
  format: {
    label: "Kies formaat",
    placeholder: "Selecteer een formaat",
  },
  includeCitations: "Citaten toevoegen",
  actions: {
    download: "Downloaden",
    largeFileDownloadPrompt: {
      title: "Uw download is klaar",
      description: "Klik hier om het downloaden te starten",
    },
    copy: "Kopiëren",
  },
  errors: {
    downloadFailed: {
      title: "❌ Downloaden mislukt",
      unknownError: "Onbekende fout opgetreden",
    },
  },
} as const satisfies Translations;
