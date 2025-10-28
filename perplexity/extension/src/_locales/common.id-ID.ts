import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage: "Lakukan donasi untuk menjaga keberlangsungan proyek!",
  },
  sponsorDialog: {
    title: "Bantu Complexity tetap luar biasa!",
    description:
      "Waktu yang tak terhitung telah dicurahkan untuk menjadikan Complexity alat yang kuat dan canggih untuk Anda. Dukungan Anda secara langsung mendorong pengembangan berkelanjutan, fitur baru, dan menjaga semuanya berjalan lancar.",
    descriptionLine2:
      "Jika Complexity menambah nilai pada alur kerja Anda, mohon pertimbangkan untuk berkontribusi pada masa depannya!",
    cometAffiliate: {
      title: "Coba Comet - Dapatkan langganan <0/> gratis!",
      description:
        "Coba Comet - browser baru dari Perplexity - dan dapatkan langganan <0/> gratis dan sementara itu berkontribusi langsung pada pengembangan Complexity.",
      claimButton: "Klaim sekarang",
      dismissButton: "Tutup",
    },
    donation: {
      title: "💖 Dukung pengembangan masa depan",
    },
    sponsorship: {
      title: "🌟 Tertarik dengan Sponsorship?",
      contactEmail: "Hubungi via Email",
    },
  },
  misc: {
    words: "kata",
    characters: "karakter",
    rewrite: "Tulis ulang",
    speakAloud: "Ucapkan dengan keras",
    stop: "Berhenti",
  },
  releaseNotes: {
    title: "Diperbarui ke v{version}",
    dontShowAgain: "Tutup dan jangan tampilkan lagi untuk pembaruan mendatang",
    confirmDialog: {
      title: "Konfirmasi",
      message:
        "Apakah Anda yakin ingin menutup dan tidak menampilkan lagi untuk pembaruan mendatang? Anda selalu dapat mengaktifkan kembali popup ini di halaman pengaturan.",
      cancel: "Batal",
      confirm: "Saya mengerti",
    },
    dismiss: "Tutup",
  },
} as const satisfies Translations;
