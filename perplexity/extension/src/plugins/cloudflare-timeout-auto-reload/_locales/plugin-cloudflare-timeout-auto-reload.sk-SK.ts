import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Časový limit relácie",
    sessionTimeoutDescription:
      "Vaša relácia vypršala (pravdepodobne kvôli Cloudflare)",
    reload: "Znovu načítať",
    dismiss: "Zavrieť",
  },
} as const satisfies Translations;
