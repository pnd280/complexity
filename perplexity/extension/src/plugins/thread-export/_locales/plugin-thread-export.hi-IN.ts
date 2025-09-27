import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "निर्यात करें",
  format: {
    label: "प्रारूप चुनें",
    placeholder: "एक प्रारूप चुनें",
  },
  includeCitations: "उद्धरण शामिल करें",
  actions: {
    download: "डाउनलोड करें",
    copy: "कॉपी करें",
  },
  errors: {
    downloadFailed: {
      title: "❌ डाउनलोड विफल रहा",
      unknownError: "अज्ञात त्रुटि हुई",
    },
  },
} as const satisfies Translations;
