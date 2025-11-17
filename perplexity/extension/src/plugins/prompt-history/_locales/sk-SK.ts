import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Vymazať históriu výziev",
      message:
        "Ste si istí, že chcete vymazať celú históriu výziev? Táto akcia sa nedá vrátiť späť.",
      actions: {
        cancel: "Zrušiť",
        confirm: "Vymazať všetko",
      },
    },
  },
  search: {
    placeholder: "Hľadať v histórii výziev...",
    noResults: "Nenašli sa žiadne výsledky",
  },
} as const satisfies LanguageMessages;
