import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Przekroczono limit czasu sesji",
    sessionTimeoutDescription:
      "Twoja sesja wygasła (prawdopodobnie z powodu Cloudflare)",
    reload: "Odśwież",
    dismiss: "Zamknij",
  },
} as const satisfies Translations;
