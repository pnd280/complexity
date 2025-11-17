import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Tampilkan Pratinjau",
    hidePreviews: "Sembunyikan Pratinjau",
  },
  input: {
    searchPlaceholder: "Cari...",
  },
  actions: {
    createNewThread: "Buat Utas Baru",
    toggleIncognitoEnable: "Aktifkan Mode Incognito",
    toggleIncognitoDisable: "Nonaktifkan Mode Incognito",
    toggleLightMode: "Ubah ke Mode Terang",
    toggleDarkMode: "Ubah ke Mode Gelap",
  },
  navigation: {
    home: "Beranda",
    library: "Perpustakaan",
    spaces: "Ruang",
    discover: "Jelajahi",
    settings: "Pengaturan",
    labs: "Labs",
    current: "Saat Ini",
    openInNewTab: "Buka di tab baru",
    goTo: "Pergi ke {destination}",
  },
  search: {
    threads: "Utas",
    spaces: "Ruang",
    threadsPlaceholder: "Cari Utas...",
    spacesPlaceholder: "Cari Ruang...",
  },
  groups: {
    actions: "Aksi",
    navigation: "Navigasi",
    search: "Pencarian",
  },
  spaces: {
    footer: {
      copyId: "Salin ID",
      copyIdSuccess: "✅ ID disalin ke clipboard",
      openInNewTab: "Buka di tab baru",
      searchInSpace: "Cari di Ruang",
      goToSpace: "Pergi ke Ruang",
      searchSpacePlaceholder: "Cari {spaceName}...",
    },
    commandItems: {
      errorFetching: "Kesalahan mengambil Ruang",
      noSpacesFound: "Tidak ada Ruang ditemukan",
    },
    preview: {
      description: "Deskripsi",
      instructions: "Instruksi",
      files: "File ({count:number})",
      webLinks: "Tautan Web ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Kesalahan mengambil Utas",
      noThreadsFound: "Tidak ada Utas ditemukan",
    },
    filters: {
      sort: {
        newest: "Terbaru",
        newestFirst: "Terbaru Dahulu",
        oldest: "Terlama",
        oldestFirst: "Terlama Dahulu",
        label: "Urutkan:",
      },
      source: {
        all: "Semua",
        label: "Sumber:",
      },
      temporaryThreads: {
        show: "Tampilkan",
        hide: "Sembunyikan",
        label: "Utas Sementara:",
        placeholder: "Utas Sementara",
      },
      type: {
        all: "Semua",
        label: "Tipe:",
        placeholder: "Tipe",
      },
    },
  },
  common: {
    noResults: "Tidak ada hasil ditemukan",
    current: "Saat Ini",
    expires: "Berakhir {date}",
  },
} as const satisfies Translations;
