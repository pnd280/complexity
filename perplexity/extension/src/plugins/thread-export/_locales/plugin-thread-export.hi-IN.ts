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
    largeFileDownloadPrompt: {
      title: "आपका डाउनलोड तैयार है",
      description: "डाउनलोड शुरू करने के लिए यहाँ क्लिक करें",
    },
    copy: "कॉपी करें",
  },
  waiting: {
    title: "कृपया प्रतीक्षा करें...",
    description: "सामग्री निकाली जा रही है, इसमें कुछ समय लग सकता है",
  },
  errors: {
    downloadFailed: {
      title: "❌ डाउनलोड विफल रहा",
      unknownError: "अज्ञात त्रुटि हुई",
    },
    copyFailed: {
      title: "❌ कॉपी विफल रहा",
      unknownError: "अज्ञात त्रुटि हुई",
    },
  },
} as const satisfies Translations;
