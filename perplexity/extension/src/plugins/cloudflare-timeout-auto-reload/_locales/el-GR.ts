import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Λήξη συνεδρίας",
    sessionTimeoutDescription:
      "Η συνεδρία σας έχει λήξει (πιθανότατα λόγω του Cloudflare)",
    reload: "Επαναφόρτωση",
    dismiss: "Παράβλεψη",
  },
} as const satisfies Translations;
