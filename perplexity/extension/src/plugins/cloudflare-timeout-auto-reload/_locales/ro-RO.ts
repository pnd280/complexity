import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Sesiune expirată",
    sessionTimeoutDescription:
      "Sesiunea dvs. a expirat (cel mai probabil din cauza Cloudflare)",
    reload: "Reîncarcă",
    dismiss: "Închide",
  },
} as const satisfies Translations;
