import type { Translations } from "@/plugins/export-thread/_locales/index";

export default {
  action: "Esporta",
  format: {
    label: "Scegli formato",
    placeholder: "Seleziona un formato",
  },
  includeCitations: "Includi citazioni",
  actions: {
    download: "Scarica",
    copy: "Copia",
  },
  errors: {
    downloadFailed: {
      title: "❌ Download fallito",
      unknownError: "Si è verificato un errore sconosciuto",
    },
  },
} as const satisfies Translations;
