import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Vymazat historii promptů",
      message:
        "Opravdu chcete vymazat celou historii promptů? Tuto akci nelze vrátit zpět.",
      actions: {
        cancel: "Zrušit",
        confirm: "Vymazat vše",
      },
    },
  },
  search: {
    placeholder: "Hledat v historii promptů...",
    noResults: "Nebyly nalezeny žádné výsledky",
  },
} as const satisfies LanguageMessages;
