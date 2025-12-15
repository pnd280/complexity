import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Vypršení relace",
    sessionTimeoutDescription:
      "Vaše relace vypršela (pravděpodobně kvůli Cloudflare)",
    reload: "Znovu načíst",
    dismiss: "Zavřít",
  },
} as const satisfies Translations;
