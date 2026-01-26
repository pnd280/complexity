import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "工作階段逾時",
    sessionTimeoutDescription: "您的工作階段已逾時（很可能是因為 Cloudflare）",
    reload: "重新載入",
    dismiss: "關閉",
  },
} as const satisfies Translations;
