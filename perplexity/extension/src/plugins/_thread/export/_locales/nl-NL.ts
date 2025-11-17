import type { Translations } from "@/plugins/_thread/export/_locales/index";

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
  waiting: {
    title: "Even geduld alstublieft...",
    description: "Inhoud wordt geëxtraheerd, dit kan even duren",
  },
  errors: {
    downloadFailed: {
      title: "❌ Downloaden mislukt",
      unknownError: "Onbekende fout opgetreden",
    },
    copyFailed: {
      title: "❌ Kopiëren mislukt",
      unknownError: "Onbekende fout opgetreden",
    },
  },
} as const satisfies Translations;
