import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Извоз",
  format: {
    label: "Изаберите формат",
    placeholder: "Изаберите формат",
  },
  includeCitations: "Укључи цитате",
  actions: {
    download: "Преузми",
    largeFileDownloadPrompt: {
      title: "Ваше преузимање је спремно",
      description: "Кликните овде да започнете преузимање",
    },
    copy: "Копирај",
  },
  errors: {
    downloadFailed: {
      title: "❌ Преузимање није успело",
      unknownError: "Дошло је до непознате грешке",
    },
  },
} as const satisfies Translations;
