import type { Translations } from "@/plugins/export-thread/_locales/index";

export default {
  action: "Exportieren",
  format: {
    label: "Format wählen",
    placeholder: "Format auswählen",
  },
  includeCitations: "Zitate einschließen",
  actions: {
    download: "Herunterladen",
    copy: "Kopieren",
  },
  errors: {
    downloadFailed: {
      title: "❌ Herunterladen fehlgeschlagen",
      unknownError: "Unbekannter Fehler aufgetreten",
    },
  },
} as const satisfies Translations;
