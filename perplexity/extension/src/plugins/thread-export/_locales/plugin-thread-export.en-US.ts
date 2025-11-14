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
    largeFileDownloadPrompt: {
      title: "Your download is ready",
      description: "Click here to start the download",
    },
    copy: "Copy",
  },
  waiting: {
    title: "Please wait...",
    description: "Extracting content, this may take a moment",
  },
  errors: {
    downloadFailed: {
      title: "❌ Failed to download",
      unknownError: "Unknown error occurred",
    },
    copyFailed: {
      title: "❌ Failed to copy",
      unknownError: "Unknown error occurred",
    },
  },
} as const satisfies LanguageMessages;
