import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "会话超时",
    sessionTimeoutDescription: "您的会话已超时（很可能是由于 Cloudflare）",
    reload: "重新加载",
    dismiss: "关闭",
  },
} as const satisfies Translations;
