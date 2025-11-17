import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Tempo limite da sessão",
    sessionTimeoutDescription:
      "A sua sessão expirou (provavelmente devido ao Cloudflare)",
    reload: "Recarregar",
    dismiss: "Fechar",
  },
} as const satisfies Translations;
