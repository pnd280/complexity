import type { Translations } from "@/plugins/export-thread/_locales/index";

export default {
  action: "Экспортировать",
  format: {
    label: "Выберите формат",
    placeholder: "Выберите формат",
  },
  includeCitations: "Включить цитаты",
  actions: {
    download: "Скачать",
    copy: "Копировать",
  },
  errors: {
    downloadFailed: {
      title: "❌ Не удалось скачать",
      unknownError: "Произошла неизвестная ошибка",
    },
  },
} as const satisfies Translations;
