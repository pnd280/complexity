import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/_thread/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Klik untuk melihat {name:enum}", {
      enum: {
        name: {
          markdown: "konten",
          mermaid: "diagram",
          plantuml: "diagram",
          html: "halaman web",
          react: "halaman web",
          markmap: "peta pikiran",
        },
      },
    }),
  },
  version: "Versi {number:number}",
  toggle: {
    preview: "Pratinjau",
    markdown: "Teks mentah",
    code: "Kode",
  },
  list: {
    title: "Artefak dalam utas ini",
    generating: "Menghasilkan...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 versi",
          other: "{?} versi",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Segarkan",
    openList: "Buka Daftar Artefak",
    openInCodeSandbox: "Buka di CodeSandbox",
    openInMermaid: "Buka di Mermaid Live Editor",
    downloadSvg: "Unduh SVG",
    downloadAsInteractiveHtml: "Unduh sebagai HTML interaktif",
    viewAsInteractiveHtml: "Lihat sebagai HTML interaktif",
  },
  error: {
    noSvg: "Tidak ditemukan SVG",
    previewUrl: "Gagal menghasilkan URL pratinjau",
  },
} as const satisfies Translations;
