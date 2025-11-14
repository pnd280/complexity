import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Esporta",
  format: {
    label: "Scegli formato",
    placeholder: "Seleziona un formato",
  },
  includeCitations: "Includi citazioni",
  actions: {
    download: "Scarica",
    largeFileDownloadPrompt: {
      title: "Il tuo download è pronto",
      description: "Clicca qui per avviare il download",
    },
    copy: "Copia",
  },
  waiting: {
    title: "Per favore aspetta...",
    description:
      "Estrazione del contenuto, questo potrebbe richiedere un momento",
  },
  errors: {
    downloadFailed: {
      title: "❌ Download fallito",
      unknownError: "Si è verificato un errore sconosciuto",
    },
    copyFailed: {
      title: "❌ Copia fallita",
      unknownError: "Si è verificato un errore sconosciuto",
    },
  },
} as const satisfies Translations;
