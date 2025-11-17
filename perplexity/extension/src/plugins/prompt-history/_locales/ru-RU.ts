import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Очистить историю запросов",
      message:
        "Вы уверены, что хотите очистить всю историю запросов? Это действие нельзя отменить.",
      actions: {
        cancel: "Отмена",
        confirm: "Очистить всё",
      },
    },
  },
  search: {
    placeholder: "Поиск в истории запросов...",
    noResults: "Результаты не найдены",
  },
} as const satisfies LanguageMessages;
