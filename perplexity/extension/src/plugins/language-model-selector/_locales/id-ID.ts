import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  languageModelSelector: {
    tooltip: "Pilih model bahasa",
    proSearch: {},
    autoMode: {
      title: "Otomatis",
      description: "Menyesuaikan dengan permintaan Anda",
    },
    usesLeft: {
      unlimited: "Tak terbatas",
      limited: dt("{count:plural} tersisa", {
        plural: {
          count: {
            one: "1 kali",
            other: "{?} kali",
          },
        },
      }),
    },
  },
  imageGenModelSelector: {
    tooltip: "Pilih model gambar",
  },
} as const satisfies LanguageMessages;
