import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Sitzungszeitüberschreitung",
    sessionTimeoutDescription:
      "Ihre Sitzung ist abgelaufen (wahrscheinlich wegen Cloudflare)",
    reload: "Neu laden",
    dismiss: "Schließen",
  },
} as const satisfies Translations;
