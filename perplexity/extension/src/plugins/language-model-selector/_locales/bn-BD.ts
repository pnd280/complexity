import { dt, type LanguageMessages } from "@complexity/i18n";

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
  },
  imageGenModelSelector: {
    tooltip: "ইমেজ মডেল নির্বাচন করুন",
  },
} as const satisfies LanguageMessages;
