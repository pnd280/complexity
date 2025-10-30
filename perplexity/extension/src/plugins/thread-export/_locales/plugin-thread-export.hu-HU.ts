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
    largeFileDownloadPrompt: {
      title: "A letöltésed elkészült",
      description: "Kattints ide a letöltés indításához",
    },
    copy: "Másolás",
  },
  errors: {
    downloadFailed: {
      title: "❌ Sikertelen letöltés",
      unknownError: "Ismeretlen hiba történt",
    },
  },
} as const satisfies Translations;
