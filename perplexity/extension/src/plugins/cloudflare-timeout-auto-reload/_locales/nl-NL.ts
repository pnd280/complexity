import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Sessie verlopen",
    sessionTimeoutDescription:
      "Uw sessie is verlopen (waarschijnlijk vanwege Cloudflare)",
    reload: "Herladen",
    dismiss: "Sluiten",
  },
} as const satisfies Translations;
