import type { Translations } from "@/plugins/_thread/export/_locales/index";

export default {
  action: "রপ্তানি করুন",
  format: {
    label: "ফরম্যাট নির্বাচন করুন",
    placeholder: "একটি ফরম্যাট নির্বাচন করুন",
  },
  includeCitations: "উদ্ধৃতি অন্তর্ভুক্ত করুন",
  actions: {
    download: "ডাউনলোড",
    largeFileDownloadPrompt: {
      title: "আপনার ডাউনলোড প্রস্তুত",
      description: "ডাউনলোড শুরু করতে এখানে ক্লিক করুন",
    },
    copy: "কপি",
  },
  waiting: {
    title: "অনুগ্রহ করে অপেক্ষা করুন...",
    description: "সামগ্রী নিষ্কাশন করা হচ্ছে, এটি কিছু সময় লাগতে পারে",
  },
  errors: {
    downloadFailed: {
      title: "❌ ডাউনলোড ব্যর্থ হয়েছে",
      unknownError: "অজানা ত্রুটি ঘটেছে",
    },
    copyFailed: {
      title: "❌ অনুলিপি ব্যর্থ হয়েছে",
      unknownError: "অজানা ত্রুটি ঘটেছে",
    },
  },
} as const satisfies Translations;
