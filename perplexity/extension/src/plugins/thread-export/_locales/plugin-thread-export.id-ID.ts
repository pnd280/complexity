import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Ekspor",
  format: {
    label: "Pilih format",
    placeholder: "Pilih format",
  },
  includeCitations: "Sertakan kutipan",
  actions: {
    download: "Unduh",
    largeFileDownloadPrompt: {
      title: "Unduhan Anda siap",
      description: "Klik di sini untuk memulai unduhan",
    },
    copy: "Salin",
  },
  errors: {
    downloadFailed: {
      title: "❌ Gagal mengunduh",
      unknownError: "Terjadi kesalahan yang tidak diketahui",
    },
  },
} as const satisfies Translations;
