import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "セッションタイムアウト",
    sessionTimeoutDescription:
      "セッションがタイムアウトしました（おそらくCloudflareによるものです）",
    reload: "再読み込み",
    dismiss: "閉じる",
  },
} as const satisfies Translations;
