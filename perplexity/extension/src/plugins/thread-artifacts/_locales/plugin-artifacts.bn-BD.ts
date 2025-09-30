import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/thread-artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("দেখার জন্য ক্লিক করুন {name:enum}", {
      enum: {
        name: {
          markdown: "কনটেন্ট",
          mermaid: "ডায়াগ্রাম",
          plantuml: "ডায়াগ্রাম",
          html: "ওয়েব পেজ",
          react: "ওয়েব পেজ",
          markmap: "মাইন্ডম্যাপ",
        },
      },
    }),
  },
  version: "সংস্করণ {number:number}",
  toggle: {
    preview: "প্রিভিউ",
    markdown: "রো টেক্সট",
    code: "কোড",
  },
  list: {
    title: "এই থ্রেডে আর্টিফ্যাক্টস",
    generating: "জেনারেট হচ্ছে...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "১টি সংস্করণ",
          other: "{?}টি সংস্করণ",
        },
      },
    }),
  },
  tooltip: {
    refresh: "রিফ্রেশ",
    openList: "আর্টিফ্যাক্টস তালিকা খুলুন",
    openInCodeSandbox: "CodeSandbox-এ খুলুন",
    openInMermaid: "Mermaid Live Editor-এ খুলুন",
    downloadSvg: "SVG ডাউনলোড করুন",
    downloadAsInteractiveHtml: "ইন্টারেক্টিভ HTML হিসেবে ডাউনলোড করুন",
    viewAsInteractiveHtml: "ইন্টারেক্টিভ HTML হিসেবে দেখুন",
  },
  error: {
    noSvg: "SVG পাওয়া যায়নি",
    previewUrl: "প্রিভিউ URL তৈরি করতে ব্যর্থ হয়েছে",
  },
} as const satisfies Translations;
