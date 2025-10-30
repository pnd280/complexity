import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Εξαγωγή",
  format: {
    label: "Επιλογή μορφής",
    placeholder: "Επιλέξτε μορφή",
  },
  includeCitations: "Συμπερίληψη παραπομπών",
  actions: {
    download: "Λήψη",
    largeFileDownloadPrompt: {
      title: "Η λήψη σας είναι έτοιμη",
      description: "Κάντε κλικ εδώ για να ξεκινήσετε τη λήψη",
    },
    copy: "Αντιγραφή",
  },
  errors: {
    downloadFailed: {
      title: "❌ Η λήψη απέτυχε",
      unknownError: "Προέκυψε άγνωστο σφάλμα",
    },
  },
} as const satisfies Translations;
