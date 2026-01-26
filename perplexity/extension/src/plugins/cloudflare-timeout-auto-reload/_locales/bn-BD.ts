import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "সেশন টাইমআউট",
    sessionTimeoutDescription:
      "আপনার সেশনের সময় শেষ হয়েছে (সম্ভবত Cloudflare এর কারণে)",
    reload: "পুনরায় লোড করুন",
    dismiss: "বন্ধ করুন",
  },
} as const satisfies Translations;
