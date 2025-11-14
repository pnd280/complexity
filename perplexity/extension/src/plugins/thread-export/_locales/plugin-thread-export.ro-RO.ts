import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Exportă",
  format: {
    label: "Alege formatul",
    placeholder: "Selectează un format",
  },
  includeCitations: "Include citările",
  actions: {
    download: "Descarcă",
    largeFileDownloadPrompt: {
      title: "Descărcarea dvs. este gata",
      description: "Faceți clic aici pentru a începe descărcarea",
    },
    copy: "Copiază",
  },
  waiting: {
    title: "Vă rugăm să așteptați...",
    description: "Extragerea conținutului, aceasta poate dura ceva timp",
  },
  errors: {
    downloadFailed: {
      title: "❌ Descărcarea a eșuat",
      unknownError: "A apărut o eroare necunoscută",
    },
    copyFailed: {
      title: "❌ Copierea a eșuat",
      unknownError: "A apărut o eroare necunoscută",
    },
  },
} as const satisfies Translations;
