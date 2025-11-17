import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Munkamenet időtúllépés",
    sessionTimeoutDescription:
      "A munkamenete lejárt (valószínűleg a Cloudflare miatt)",
    reload: "Újratöltés",
    dismiss: "Bezárás",
  },
} as const satisfies Translations;
