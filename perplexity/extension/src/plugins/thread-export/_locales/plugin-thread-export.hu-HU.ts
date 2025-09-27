import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Exportálás",
  format: {
    label: "Formátum választása",
    placeholder: "Válassz formátumot",
  },
  includeCitations: "Hivatkozások hozzáadása",
  actions: {
    download: "Letöltés",
    copy: "Másolás",
  },
  errors: {
    downloadFailed: {
      title: "❌ Sikertelen letöltés",
      unknownError: "Ismeretlen hiba történt",
    },
  },
} as const satisfies Translations;
