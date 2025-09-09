import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Expiration de session",
    sessionTimeoutDescription:
      "Votre session a expiré (probablement à cause de Cloudflare)",
    reload: "Recharger",
    dismiss: "Fermer",
  },
} as const satisfies Translations;
