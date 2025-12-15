import type { Translations } from "@/plugins/prompt-history/_locales/index";

export default {
  clearAllButton: {
    dialog: {
      title: "Șterge istoricul prompturilor",
      message:
        "Sigur doriți să ștergeți tot istoricul prompturilor? Această acțiune nu poate fi anulată.",
      actions: {
        cancel: "Anulează",
        confirm: "Șterge tot",
      },
    },
  },
  search: {
    placeholder: "Caută în istoricul prompturilor...",
    noResults: "Niciun rezultat găsit",
  },
} as const satisfies Translations;
