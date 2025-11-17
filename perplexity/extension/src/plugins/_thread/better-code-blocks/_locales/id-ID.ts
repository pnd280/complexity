import type { LanguageMessages } from "@complexity/i18n";

export default {
  headerButtons: {
    wrap: {
      wrap: "Bungkus baris",
      unwrap: "Buka bungkus baris",
    },
    expand: {
      expand: "Perluas",
      collapse: "Tutup",
    },
  },
} as const satisfies LanguageMessages;
