import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/language-model-selector/_locales";

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
    modelsListEditToggle: {
      instruction:
        "Klik model apa pun untuk menampilkan/menyembunyikan dari daftar",
      save: "Simpan",
    },
  },
  imageGenModelSelector: {
    tooltip: "Pilih model gambar",
  },
} as const satisfies Translations;
