import type { Translations } from "@/plugins/export-thread/_locales/index";

export default {
  action: "Извоз",
  format: {
    label: "Изаберите формат",
    placeholder: "Изаберите формат",
  },
  includeCitations: "Укључи цитате",
  actions: {
    download: "Преузми",
    copy: "Копирај",
  },
  errors: {
    downloadFailed: {
      title: "❌ Преузимање није успело",
      unknownError: "Дошло је до непознате грешке",
    },
  },
} as const satisfies Translations;
