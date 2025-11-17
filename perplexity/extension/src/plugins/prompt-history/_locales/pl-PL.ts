import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Wyczyść historię podpowiedzi",
      message:
        "Czy na pewno chcesz wyczyścić całą historię podpowiedzi? Tej operacji nie można cofnąć.",
      actions: {
        cancel: "Anuluj",
        confirm: "Wyczyść wszystko",
      },
    },
  },
  search: {
    placeholder: "Szukaj w historii podpowiedzi...",
    noResults: "Nie znaleziono wyników",
  },
} as const satisfies LanguageMessages;
