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
    copy: "Copiază",
  },
  errors: {
    downloadFailed: {
      title: "❌ Descărcarea a eșuat",
      unknownError: "A apărut o eroare necunoscută",
    },
  },
} as const satisfies Translations;
