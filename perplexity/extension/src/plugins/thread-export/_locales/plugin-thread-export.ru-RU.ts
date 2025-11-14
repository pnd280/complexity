import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Экспортировать",
  format: {
    label: "Выберите формат",
    placeholder: "Выберите формат",
  },
  includeCitations: "Включить цитаты",
  actions: {
    download: "Скачать",
    largeFileDownloadPrompt: {
      title: "Ваша загрузка готова",
      description: "Нажмите здесь, чтобы начать загрузку",
    },
    copy: "Копировать",
  },
  waiting: {
    title: "Пожалуйста, подождите...",
    description: "Извлечение содержимого, это может занять некоторое время",
  },
  errors: {
    downloadFailed: {
      title: "❌ Не удалось скачать",
      unknownError: "Произошла неизвестная ошибка",
    },
    copyFailed: {
      title: "❌ Не удалось скопировать",
      unknownError: "Произошла неизвестная ошибка",
    },
  },
} as const satisfies Translations;
