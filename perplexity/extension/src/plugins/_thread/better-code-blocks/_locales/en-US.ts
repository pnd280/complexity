import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Wrap lines",
      unwrap: "Unwrap lines",
    },
    expand: {
      expand: "Expand",
      collapse: "Collapse",
    },
  },
} as const satisfies LanguageMessages;
