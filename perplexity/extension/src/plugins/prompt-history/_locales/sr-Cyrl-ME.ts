import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Обриши историју упита",
      message:
        "Да ли сте сигурни да желите да обришете сву историју упита? Ова радња се не може поништити.",
      actions: {
        cancel: "Откажи",
        confirm: "Обриши све",
      },
    },
  },
  search: {
    placeholder: "Претражи историју упита...",
    noResults: "Нема резултата",
  },
} as const satisfies LanguageMessages;
