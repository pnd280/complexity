import type { Translations } from "@/plugins/export-thread/_locales/index";

export default {
  action: "Εξαγωγή",
  format: {
    label: "Επιλογή μορφής",
    placeholder: "Επιλέξτε μορφή",
  },
  includeCitations: "Συμπερίληψη παραπομπών",
  actions: {
    download: "Λήψη",
    copy: "Αντιγραφή",
  },
  errors: {
    downloadFailed: {
      title: "❌ Η λήψη απέτυχε",
      unknownError: "Προέκυψε άγνωστο σφάλμα",
    },
  },
} as const satisfies Translations;
