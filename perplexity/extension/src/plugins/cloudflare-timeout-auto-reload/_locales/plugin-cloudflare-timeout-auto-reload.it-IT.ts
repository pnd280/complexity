import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Timeout della sessione",
    sessionTimeoutDescription:
      "La tua sessione è scaduta (molto probabilmente a causa di Cloudflare)",
    reload: "Ricarica",
    dismiss: "Chiudi",
  },
} as const satisfies Translations;
