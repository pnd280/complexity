import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage: "প্রজেক্টটি চালিয়ে রাখতে একটি দান করুন!",
  },
  sponsorDialog: {
    title: "Complexity কে অসাধারণ রাখতে সাহায্য করুন!",
    description:
      "আপনার জন্য Complexity কে একটি শক্তিশালী এবং পরিষ্কার টুল বানাতে অসংখ্য ঘন্টা ব্যয় করা হয়েছে। আপনার সমর্থন সরাসরি চলমান উন্নয়ন, নতুন বৈশিষ্ট্য, এবং সবকিছু সুচারুভাবে চালু রাখতে সাহায্য করে।",
    descriptionLine2:
      "যদি Complexity আপনার কাজের প্রবাহে মূল্য যোগ করে, তাহলে অনুগ্রহ করে এর ভবিষ্যতে অবদান রাখার কথা বিবেচনা করুন!",
    cometAffiliate: {
      title: "Comet চেষ্টা করুন - একটি বিনামূল্যে <0/> সাবস্ক্রিপশন পান!",
      description:
        "Comet চেষ্টা করুন - Perplexity এর নতুন ব্রাউজার - এবং একটি বিনামূল্যে <0/> সাবস্ক্রিপশন পান এবং এর মধ্যে সরাসরি Complexity এর উন্নয়নে অবদান রাখুন।",
      claimButton: "এখনই দাবি করুন",
      dismissButton: "খারিজ করুন",
    },
    donation: {
      title: "💖 ভবিষ্যৎ উন্নয়নে সমর্থন করুন",
    },
    sponsorship: {
      title: "🌟 স্পনসরশিপে আগ্রহী?",
      contactEmail: "ইমেইলের মাধ্যমে যোগাযোগ করুন",
    },
  },
  misc: {
    words: "শব্দ",
    characters: "অক্ষর",
    rewrite: "পুনরায় লিখুন",
    speakAloud: "জোরে বলুন",
    stop: "থামুন",
  },
  releaseNotes: {
    title: "v{version} এ আপডেট করা হয়েছে",
    dontShowAgain: "খারিজ করুন এবং ভবিষ্যৎ আপডেটের জন্য আর দেখাবেন না",
    confirmDialog: {
      title: "নিশ্চিত করুন",
      message:
        "আপনি কি নিশ্চিত যে আপনি খারিজ করতে চান এবং ভবিষ্যৎ আপডেটের জন্য আর দেখাতে চান না? আপনি সর্বদা সেটিংস পৃষ্ঠায় এই পপআপটি পুনরায় সক্রিয় করতে পারেন।",
      cancel: "বাতিল করুন",
      confirm: "আমি বুঝতে পেরেছি",
    },
    dismiss: "খারিজ করুন",
  },
} as const satisfies Translations;
