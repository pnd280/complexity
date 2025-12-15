import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

export default {
  headerButtons: {
    wrap: {
      wrap: "Sorok tördelése",
      unwrap: "Sorok tördelésének megszüntetése",
    },
    expand: {
      expand: "Kibontás",
      collapse: "Összecsukás",
    },
  },
} as const satisfies Translations;
