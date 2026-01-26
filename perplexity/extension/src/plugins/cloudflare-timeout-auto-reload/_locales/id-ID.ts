import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Sesi habis",
    sessionTimeoutDescription:
      "Sesi Anda telah habis (kemungkinan besar karena Cloudflare)",
    reload: "Muat ulang",
    dismiss: "Tutup",
  },
} as const satisfies Translations;
