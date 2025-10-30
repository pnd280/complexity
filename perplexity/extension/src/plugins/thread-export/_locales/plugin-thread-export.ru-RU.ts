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
  errors: {
    downloadFailed: {
      title: "❌ Не удалось скачать",
      unknownError: "Произошла неизвестная ошибка",
    },
  },
} as const satisfies Translations;
