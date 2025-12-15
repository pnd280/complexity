import type { Translations } from "@/plugins/prompt-history/_locales/index";

export default {
  clearAllButton: {
    dialog: {
      title: "Cancella cronologia prompt",
      message:
        "Sei sicuro di voler cancellare tutta la cronologia dei prompt? Questa azione non può essere annullata.",
      actions: {
        cancel: "Annulla",
        confirm: "Cancella tutto",
      },
    },
  },
  search: {
    placeholder: "Cerca nella cronologia dei prompt...",
    noResults: "Nessun risultato trovato",
  },
} as const satisfies Translations;
