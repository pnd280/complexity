import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Előzmények törlése",
      message:
        "Biztosan törölni szeretné az összes előzményt? Ez a művelet nem visszavonható.",
      actions: {
        cancel: "Mégse",
        confirm: "Összes törlése",
      },
    },
  },
  search: {
    placeholder: "Előzmények keresése...",
    noResults: "Nincs találat",
  },
} as const satisfies LanguageMessages;
