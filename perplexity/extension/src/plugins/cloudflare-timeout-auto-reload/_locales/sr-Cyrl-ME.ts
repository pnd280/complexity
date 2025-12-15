import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Истек сесије",
    sessionTimeoutDescription:
      "Ваша сесија је истекла (највероватније због Cloudflare-а)",
    reload: "Поново учитај",
    dismiss: "Одбаци",
  },
} as const satisfies Translations;
