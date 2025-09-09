import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Сеанс завершён",
    sessionTimeoutDescription:
      "Ваш сеанс был завершён (скорее всего из-за Cloudflare)",
    reload: "Перезагрузить",
    dismiss: "Закрыть",
  },
} as const satisfies Translations;
