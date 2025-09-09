import type { Translations } from "@/plugins/export-thread/_locales/index";

export default {
  action: "Exporteren",
  format: {
    label: "Kies formaat",
    placeholder: "Selecteer een formaat",
  },
  includeCitations: "Citaten toevoegen",
  actions: {
    download: "Downloaden",
    copy: "Kopiëren",
  },
  errors: {
    downloadFailed: {
      title: "❌ Downloaden mislukt",
      unknownError: "Onbekende fout opgetreden",
    },
  },
} as const satisfies Translations;
