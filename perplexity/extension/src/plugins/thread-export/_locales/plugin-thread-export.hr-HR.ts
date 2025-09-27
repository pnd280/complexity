import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Izvoz",
  format: {
    label: "Odaberi format",
    placeholder: "Odaberi format",
  },
  includeCitations: "Uključi citate",
  actions: {
    download: "Preuzmi",
    copy: "Kopiraj",
  },
  errors: {
    downloadFailed: {
      title: "❌ Preuzimanje nije uspjelo",
      unknownError: "Dogodila se nepoznata pogreška",
    },
  },
} as const satisfies Translations;
