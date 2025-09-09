import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Istek sesije",
    sessionTimeoutDescription:
      "Vaša sesija je istekla (najvjerojatnije zbog Cloudflare-a)",
    reload: "Ponovno učitaj",
    dismiss: "Zatvori",
  },
} as const satisfies Translations;
