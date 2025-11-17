import type { Translations } from "@/plugins/_thread/export/_locales/index";

export default {
  action: "Exporter",
  format: {
    label: "Choisir le format",
    placeholder: "Sélectionner un format",
  },
  includeCitations: "Inclure les citations",
  actions: {
    download: "Télécharger",
    largeFileDownloadPrompt: {
      title: "Votre téléchargement est prêt",
      description: "Cliquez ici pour démarrer le téléchargement",
    },
    copy: "Copier",
  },
  waiting: {
    title: "Veuillez patienter...",
    description: "Extraction du contenu, cela peut prendre un moment",
  },
  errors: {
    downloadFailed: {
      title: "❌ Échec du téléchargement",
      unknownError: "Une erreur inconnue est survenue",
    },
    copyFailed: {
      title: "❌ Échec de la copie",
      unknownError: "Une erreur inconnue est survenue",
    },
  },
} as const satisfies Translations;
