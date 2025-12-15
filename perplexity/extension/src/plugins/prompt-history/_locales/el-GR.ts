import type { Translations } from "@/plugins/prompt-history/_locales/index";

export default {
  clearAllButton: {
    dialog: {
      title: "Διαγραφή Ιστορικού Προτροπών",
      message:
        "Είστε σίγουροι ότι θέλετε να διαγράψετε όλο το ιστορικό προτροπών; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.",
      actions: {
        cancel: "Ακύρωση",
        confirm: "Διαγραφή Όλων",
      },
    },
  },
  search: {
    placeholder: "Αναζήτηση ιστορικού προτροπών...",
    noResults: "Δεν βρέθηκαν αποτελέσματα",
  },
} as const satisfies Translations;
