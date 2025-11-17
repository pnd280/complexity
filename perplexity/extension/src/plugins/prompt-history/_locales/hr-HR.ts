import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Obriši povijest upita",
      message:
        "Jeste li sigurni da želite obrisati svu povijest upita? Ova radnja se ne može poništiti.",
      actions: {
        cancel: "Odustani",
        confirm: "Obriši sve",
      },
    },
  },
  search: {
    placeholder: "Pretraži povijest upita...",
    noResults: "Nema rezultata",
  },
} as const satisfies LanguageMessages;
