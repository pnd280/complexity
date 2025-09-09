import type { Translations } from "@/plugins/export-thread/_locales/index";

export default {
  action: "রপ্তানি করুন",
  format: {
    label: "ফরম্যাট নির্বাচন করুন",
    placeholder: "একটি ফরম্যাট নির্বাচন করুন",
  },
  includeCitations: "উদ্ধৃতি অন্তর্ভুক্ত করুন",
  actions: {
    download: "ডাউনলোড",
    copy: "কপি",
  },
  errors: {
    downloadFailed: {
      title: "❌ ডাউনলোড ব্যর্থ হয়েছে",
      unknownError: "অজানা ত্রুটি ঘটেছে",
    },
  },
} as const satisfies Translations;
