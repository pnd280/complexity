import type { Translations } from "@/plugins/cloudflare-timeout-auto-reload/_locales/index";

export default {
  actionDialog: {
    sessionTimeoutTitle: "세션 시간 초과",
    sessionTimeoutDescription:
      "세션이 시간 초과되었습니다 (대부분 Cloudflare로 인한 것입니다)",
    reload: "새로고침",
    dismiss: "닫기",
  },
} as const satisfies Translations;
