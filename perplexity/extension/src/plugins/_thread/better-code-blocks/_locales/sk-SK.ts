import type { Translations } from "@/plugins/_thread/better-code-blocks/_locales/index";

export default {
  headerButtons: {
    wrap: {
      wrap: "Zalomiť riadky",
      unwrap: "Zrušiť zalomenie riadkov",
    },
    expand: {
      expand: "Rozbaliť",
      collapse: "Zbaliť",
    },
  },
} as const satisfies Translations;
