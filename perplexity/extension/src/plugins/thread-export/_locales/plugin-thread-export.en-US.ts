import type { LanguageMessages } from "@complexity/i18n";

export default {
  action: "Export",
  format: {
    label: "Choose format",
    placeholder: "Select a format",
  },
  includeCitations: "Include citations",
  actions: {
    download: "Download",
    copy: "Copy",
  },
  errors: {
    downloadFailed: {
      title: "❌ Failed to download",
      unknownError: "Unknown error occurred",
    },
  },
} as const satisfies LanguageMessages;
