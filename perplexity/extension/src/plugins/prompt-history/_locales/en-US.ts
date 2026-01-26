import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Clear Prompt History",
      message:
        "Are you sure you want to clear all prompt history? This action cannot be undone.",
      actions: {
        cancel: "Cancel",
        confirm: "Clear All",
      },
    },
  },
  search: {
    placeholder: "Search prompt history...",
    noResults: "No results found",
  },
} as const satisfies LanguageMessages;
