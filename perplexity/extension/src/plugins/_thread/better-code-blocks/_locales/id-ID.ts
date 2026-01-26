import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

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
} as const satisfies Translations;
