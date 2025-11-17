import type { LanguageMessages } from "@complexity/i18n";

export default {
  actionDialog: {
    sessionTimeoutTitle: "Session timeout",
    sessionTimeoutDescription:
      "Your session has been timed out (most likely due to Cloudflare)",
    reload: "Reload",
    dismiss: "Dismiss",
  },
} as const satisfies LanguageMessages;
