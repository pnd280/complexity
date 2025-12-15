import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

export default {
  languageModelSelector: {
    tooltip: "ভাষার মডেল নির্বাচন করুন",
    proSearch: {},
    autoMode: {
      title: "স্বয়ংক্রিয়",
      description: "আপনার কুয়েরি অনুযায়ী মানিয়ে নেয়",
    },
    usesLeft: {
      unlimited: "সীমাহীন",
      limited: dt("{count:plural} বাকি", {
        plural: {
          count: {
            one: "১ বার ব্যবহার",
            other: "{?} বার ব্যবহার",
          },
        },
      }),
    },
    modelsListEditToggle: {
      instruction: "তালিকা থেকে প্রদর্শন/লুকানোর জন্য যেকোনো মডেলে ক্লিক করুন",
      save: "সংরক্ষণ",
    },
  },
  imageGenModelSelector: {
    tooltip: "ইমেজ মডেল নির্বাচন করুন",
  },
} as const satisfies Translations;
