import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Promptgeschiedenis wissen",
      message:
        "Weet je zeker dat je alle promptgeschiedenis wilt wissen? Deze actie kan niet ongedaan worden gemaakt.",
      actions: {
        cancel: "Annuleren",
        confirm: "Alles wissen",
      },
    },
  },
  search: {
    placeholder: "Zoek in promptgeschiedenis...",
    noResults: "Geen resultaten gevonden",
  },
} as const satisfies LanguageMessages;
