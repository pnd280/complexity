import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Effacer l'historique des invites",
      message:
        "Êtes-vous sûr de vouloir effacer tout l'historique des invites ? Cette action est irréversible.",
      actions: {
        cancel: "Annuler",
        confirm: "Tout effacer",
      },
    },
  },
  search: {
    placeholder: "Rechercher dans l'historique des invites...",
    noResults: "Aucun résultat trouvé",
  },
} as const satisfies LanguageMessages;
