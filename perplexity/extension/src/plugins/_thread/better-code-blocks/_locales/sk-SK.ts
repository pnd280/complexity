import type { LanguageMessages } from "@complexity/i18n";

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
} as const satisfies LanguageMessages;
