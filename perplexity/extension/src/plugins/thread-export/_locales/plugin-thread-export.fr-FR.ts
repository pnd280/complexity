import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Exporter",
  format: {
    label: "Choisir le format",
    placeholder: "Sélectionner un format",
  },
  includeCitations: "Inclure les citations",
  actions: {
    download: "Télécharger",
    copy: "Copier",
  },
  errors: {
    downloadFailed: {
      title: "❌ Échec du téléchargement",
      unknownError: "Une erreur inconnue est survenue",
    },
  },
} as const satisfies Translations;
