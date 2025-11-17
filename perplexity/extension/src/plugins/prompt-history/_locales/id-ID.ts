import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Hapus Riwayat Prompt",
      message:
        "Apakah Anda yakin ingin menghapus semua riwayat prompt? Tindakan ini tidak dapat dibatalkan.",
      actions: {
        cancel: "Batal",
        confirm: "Hapus Semua",
      },
    },
  },
  search: {
    placeholder: "Cari riwayat prompt...",
    noResults: "Tidak ada hasil ditemukan",
  },
} as const satisfies LanguageMessages;
