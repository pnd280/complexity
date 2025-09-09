import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage:
      "Mohon pertimbangkan untuk menjadi <0>Pendukung</0> untuk menjaga keberlangsungan proyek!",
  },
  sponsorDialog: {
    title: "Bantu Complexity tetap luar biasa!",
    description:
      "Kami telah mencurahkan waktu yang tak terhitung untuk menjadikan Complexity alat yang kuat dan canggih untuk Anda. Dukungan Anda secara langsung mendorong pengembangan berkelanjutan, fitur baru, dan menjaga semuanya berjalan lancar.",
    descriptionLine2:
      "Jika Complexity menambah nilai pada alur kerja Anda, mohon pertimbangkan untuk berkontribusi pada masa depannya!",
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
