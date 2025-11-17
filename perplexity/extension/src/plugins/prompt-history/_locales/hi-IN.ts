import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "प्रॉम्प्ट इतिहास साफ़ करें",
      message:
        "क्या आप वाकई सभी प्रॉम्प्ट इतिहास को साफ़ करना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।",
      actions: {
        cancel: "रद्द करें",
        confirm: "सभी साफ़ करें",
      },
    },
  },
  search: {
    placeholder: "प्रॉम्प्ट इतिहास खोजें...",
    noResults: "कोई परिणाम नहीं मिला",
  },
} as const satisfies LanguageMessages;
