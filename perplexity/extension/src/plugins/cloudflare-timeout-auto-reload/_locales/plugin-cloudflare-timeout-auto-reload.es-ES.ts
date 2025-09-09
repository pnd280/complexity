import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Tiempo de sesión agotado",
    sessionTimeoutDescription:
      "Su sesión ha caducado (probablemente debido a Cloudflare)",
    reload: "Recargar",
    dismiss: "Cerrar",
  },
} as const satisfies Translations;
