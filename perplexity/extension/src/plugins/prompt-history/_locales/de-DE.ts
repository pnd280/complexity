import type { Translations } from "@/plugins/prompt-history/_locales/index";

export default {
  clearAllButton: {
    dialog: {
      title: "Eingabeverlauf löschen",
      message:
        "Sind Sie sicher, dass Sie den gesamten Eingabeverlauf löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
      actions: {
        cancel: "Abbrechen",
        confirm: "Alles löschen",
      },
    },
  },
  search: {
    placeholder: "Eingabeverlauf durchsuchen...",
    noResults: "Keine Ergebnisse gefunden",
  },
} as const satisfies Translations;
