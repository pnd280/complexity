import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Exportieren",
  format: {
    label: "Format wählen",
    placeholder: "Format auswählen",
  },
  includeCitations: "Zitate einschließen",
  actions: {
    download: "Herunterladen",
    largeFileDownloadPrompt: {
      title: "Ihr Download ist bereit",
      description: "Klicken Sie hier, um den Download zu starten",
    },
    copy: "Kopieren",
  },
  errors: {
    downloadFailed: {
      title: "❌ Herunterladen fehlgeschlagen",
      unknownError: "Unbekannter Fehler aufgetreten",
    },
  },
} as const satisfies Translations;
